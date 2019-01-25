
/**********************************************************
 * 
 * 此js仅供参考，主要目的用于演示。
 * 因很多业务类型测试环境无法测试，本js对未测试的业务可能存在bug。
 * 请一定在理解billQueryInfo和billDetailInfo的处理后修改。
 * 
 ***********************************************************/

var G_CONF = {
		action_query:'prequery',
		action_pay:'prepay',
		showErr  : function(text){
			$(".err-msg label").text(text ? text : '输入项有误，请核实您的输入信息');
			$(".err-msg").show();
			setTimeout(function(){
				$(".err-msg").hide();
			},2000);
		},
		resetErr : function(){$(".err-msg").hide()},
};


/*
 * 
 * default behavior
 * 
 */
function buildDefault(bizcontent, bussCode){	
	
	G_CONF.bizcontent = bizcontent;
	bizcontent.show();
	bizcontent.html("查询账单要素中……");
		
	var jqxhr = $.get(bizUrl + "?bussCode=" + bussCode, function(data, status){
		bizcontent.html("");
//	    alert("Data: " + data + "\nStatus: " + status);
	    if (status != "success"){
	    	G_CONF.bizcontent.html("地址写错");
	    }
	    try {
		    generate(JSON.parse(dealWithSina(data)));
			G_CONF.bizcontent.find('input[type=text]').first().focus();
	    } catch (e) {
	    	G_CONF.bizcontent.html("查询要素失败，请确定bussCode写对，访问地址："
	    			+bizUrl + "?bussCode=" + bussCode
	    			+"<br>原文：" + HtmlUtil.htmlEncodeByRegExp(data)
	    			+"<br>异常信息：" + e);
	    }
	});

	return true;
}

function dealWithSina(data){
	// 这个是开发包作者代码放了新浪云测试某些东西，为了回避新浪实名认证提示信息用的，正常情况不要用。
	if(data.match(/^[\[{]/)!=null && data.match(/script>$/)!=null){
		var index = data.indexOf("<script");
		return data.substring(0, index);
	} else {
		return data;
	}
}

function generate(biz){
	G_CONF.queryId = "";
	G_CONF.code = biz.code;
//	alert(JSON.stringify(biz.form));
	generateForm(biz.form);
	
	if(G_CONF.bizcontent.find('.button').length > 0){
		return ;
	}
	if(getAmount() === false) //出现了hidden且金额为0的情况认为不支持预缴且无欠费所以不显示button
		return;
	buildButton(biz.action);
}

function buildButton(actionValue){
	
	if(actionValue !== G_CONF.action_query && actionValue !== G_CONF.action_pay){
		return;
	} 

	var widget = $("#template .button").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	var w;
	if(actionValue === G_CONF.action_query){
		w = widget.find('input').val("查询");
	} else if(actionValue === G_CONF.action_pay){
		w = widget.find('input').val("立即支付");
	}
	w.bind('click', {action : actionValue}, clickButton);
}

function clickButton(e){

	G_CONF.resetErr();
	
	var apiForm = G_CONF.bizcontent.parents(".api-form");
	var billQueryInfo = getBillQueryInfo(e);
	if(billQueryInfo === false) return false;
	var urlPath = "";
	var dataToSend = {};

	G_CONF.billQueryInfo = billQueryInfo;

//	alert(getAmount());
//	alert(billQueryInfo);
	
	if(e.data.action === G_CONF.action_query){
		urlPath = billQueryUrl;
		dataToSend = {
				billQueryInfo : billQueryInfo,
				bussCode : G_CONF.code,
				merId : apiForm.find("[name='merId']").val(),
				txnTime : apiForm.find("[name='txnTime']").val(),
				orderId : apiForm.find("[name='orderId']").val(),
			};
		if ( G_CONF.queryId !== undefined  ){
	    	dataToSend.origQryId = G_CONF.queryId;
	    }
	    
		var jqxhr = $.post(urlPath, dataToSend, handleQuery)
		    .error(handleError);
		G_CONF.bizcontent.html("查询中……");
			
	} else if(e.data.action === G_CONF.action_pay){
		
		apiForm.attr("action", billPayUrl);
	    apiForm.find("input[name='txnAmt']").remove();
	    apiForm.find("input[name='origQryId']").remove();
	    apiForm.find("input[name='billQueryInfo']").remove();
        $("<input type=\"hidden\" name=\"txnAmt\" value=\""+getAmount()+"\">").appendTo(apiForm);
	    if ( G_CONF.queryId !== undefined  ){
	    	$("<input type=\"hidden\" name=\"origQryId\" value=\""+G_CONF.queryId+"\">").appendTo(apiForm);
	    }
	    $("<input type=\"hidden\" name=\"billQueryInfo\" value=\""+HtmlUtil.htmlEncodeByRegExp(billQueryInfo)+"\">").appendTo(apiForm);
	    apiForm.submit();
	}
	return false;
}

function getBillQueryInfo(e){
	var OK = true;
	var billQueryInfo = new Object();
	G_CONF.bizcontent.children().each(function(){
		
		if($(this).attr('class') === "button" 
			|| $(this).attr('class') === 'string' 
			|| $(this).attr('class') === 'multibillstring'){
			return;
		}
		
		if($(this).attr('class') === "multibill"){
			$(this).data('value', "");
			var mbill = new Array();
			var k = 0;
			$(this).find("input[type='checkbox']:checked").each(function(){
			    mbill[k++] = ""+$(this).data('value');
				});
			if( mbill.length > 0 )
				$(this).data('value', mbill);
		}
		
		if($(this).data('value') === "" || $(this).data('value') === undefined){
			G_CONF.showErr();
			$(this).focus();
			OK = false;
			return false;
		}
		billQueryInfo[$(this).data().name] = $(this).data().value;
	});
	
	// 处理button的kv
	if((e.data.name != "" || e.data.name != undefined) &&  e.data.value != undefined){
		billQueryInfo[e.data.name] = e.data.value;
	}
	
	if (!OK) { return false;}
	return JSON.stringify(billQueryInfo);
}

function getAmount() {
	
	var OK = true
	var amount = 0;
	G_CONF.bizcontent.children().each(function(){
		if ("amount" === $(this).data().name && 
				($(this).attr('class') === 'single'
				|| $(this).attr('class') === 'text')){
			amount = dealWithAmount($(this).data().value);
			return false;
		} else if ("amount" === $(this).data().name 
				&& $(this).attr('class') === 'hidden'){
			amount = dealWithAmount($(this).data().value);
			if(amount === 0) //出现了hidden且金额为0的情况认为不支持预缴且无欠费所以不显示button
				OK = false
			return false;
		} else if ($(this).attr('class') === 'bill' 
			|| $(this).attr('class') === 'multibillstring'
			|| $(this).attr('class') === 'singlebill') {
			alert (amt);
			amount = dealWithAmount($(this).data().amount);
			alert (tmp);
			return false;
		} else if ( $(this).attr('class') === 'multibill'){
			$(this).find("input[type='checkbox']:checked").each(function(){
			    amount += dealWithAmount($(this).data('amount'));
				});
			$(this).data('amount', amount);
			return false;
		}
	});
	if (!OK) { return false;}
	return amount;
}

//转成整数，老司机告诉你，不能直接乘以100。
function dealWithAmount(amt) {
	var tmp = amt.split(".");
	if(tmp.length == 1){
		return parseInt(tmp + "00");
	} else if (tmp[1].length == 1 ){
		return parseInt(tmp[0] + tmp[1] + "0");
	} else if (tmp[1].length == 2 ){
		return parseInt(tmp[0] + tmp[1]);
	} else {
		//大哥你bug了。
	}
}

function handleError(XMLHttpRequest, textStatus, errorThrown) {
	alert("http request error, XMLHttpRequest.status = " + XMLHttpRequest.status
			+ "XMLHttpRequest.readyState" + XMLHttpRequest.readyState
			+ "textStatus" + textStatus);
	G_CONF.showErr("哦... 出了点问题,再试一次?");
}


//receive success query response
function handleQuery(responseText, textStatus, jqXHR) {
	G_CONF.bizcontent.html("");
	try {
		var response = JSON.parse(dealWithSina(responseText));
//		alert("json格式应答："+responseText);
	} catch (e){ 
//		alert("非json格式应答："+responseText);
		G_CONF.bizcontent.html("账单查询失败啦，请看下弹窗里打印的信息。如弹窗未正常跳出，浏览器请设置一下允许弹窗。");
		var w = window.open("", "_blank");
		w.document.write(responseText);
	    return;
	}
	var form = response.billDetailInfo;
	generate(form);
	G_CONF.queryId = response.queryId;
}

var HtmlUtil = {
		
	 /*1.用正则表达式实现html转码*/
	 htmlEncodeByRegExp:function (str){  
	     var s = "";
	     if(str.length == 0) return "";
	     s = str.replace(/&/g,"&amp;");
	     s = s.replace(/</g,"&lt;");
	     s = s.replace(/>/g,"&gt;");
	     s = s.replace(/ /g,"　");
	     s = s.replace(/\'/g,"&#39;");
	     s = s.replace(/\"/g,"&quot;");
	     return s;  
	 },

	 /*2.用正则表达式实现html解码*/
	 htmlDecodeByRegExp:function (str){  
	     var s = "";
	     if(str.length == 0) return "";
	     s = str.replace(/&amp;/g,"&");
	     s = s.replace(/&lt;/g,"<");
	     s = s.replace(/&gt;/g,">");
	     s = s.replace(/　/g," ");
	     s = s.replace(/&#39;/g,"\'");
	     s = s.replace(/&quot;/g,"\"");
	     return s;  
	 }
};

function generateForm(form){
//	alert(G_CONF.bizcontent.html());
//	alert(JSON.stringify(form));
	G_CONF.bizcontent.children().remove();
	G_CONF.bizcontent.find('.button').remove();
	for(var i=0;i<form.length;i++){
		var formItem = FormBuilder.build(form[i].type);
		formItem.set(form[i]);
	}
//	alert(G_CONF.bizcontent.html());
}

/*
 * form buider begin
 * which is a formItemBuilder object.
 * 
 */
function FormBuilder(){}

FormBuilder.build = function (type, val){
	var constr = type.toLowerCase();// 某String不知道为啥大写的bug，{"value":"后付费","label":"付费标志","type":"String"}
	if(typeof FormBuilder[constr] !== 'function'){
		throw {
		}
	}
	if(typeof FormBuilder[constr].prototype.make !== 'function'){
		FormBuilder[constr].prototype = new FormBuilder();
	}
	var newForm = new FormBuilder[constr]();
	return newForm;
}

FormBuilder.prototype.set = function(val){
	this.set(val);
}

FormBuilder.prototype.get = function getValue(val, defaultVal){
	if(defaultVal){
		return val==null ? defaultVal : val; 
	}
	if(val === "用户销根号"){
		return "销根号";
	} else if(val === "缴费金额(元)"){
		return "缴费金额";
	} else if(val === "缴费金额(任意)"){
		return "缴费金额";
	} else if(val === "电脑编码或社保号"){
		return "账号";
	} else if(val === "开始所属日期"){
		return "开始日期";
	} else if(val === "结束所属日期"){
		return "结束日期";
	}  else if(val === "自来水户号（水表号）"){
		return "户号";
	}  else if(val === "选择查询账单"){
		return "查询账单";
	}  else if(val === "再次输入条形码"){
        return "再次输入";
    }
	return val==null ? "" : val;
}

FormBuilder.string = function(){
	var widget = $("#template .string").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	
	this.set = function(val){
		widget.find('.string-label').text(this.get(val.label)); //null
		widget.find('.string-value').text(this.get(val.value)); 
	}
}

FormBuilder.hidden = function(){
	var widget = $("#template .hidden").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	
	this.set = function(val){
		widget.data('name', val.name);
		//widget.find('input').val(val.value);
		widget.data('value', val.value);
	}
}

FormBuilder.text = function(){
	
	var widget = $("#template .text").first().clone();
	widget.appendTo(G_CONF.bizcontent); 
	
	this.set = function(val){
		widget.find('label').text(this.get(val.label));
		widget.find('input').val(this.get(val.value));
		widget.data('name', val.name);
		widget.data('value', this.get(val.value));
		widget.data('label', this.get(val.label));
		widget.data('required', "required");
		widget.find('input').blur(function(){
			widget.data('value', $(this).val());
		});
	}
}

FormBuilder.bill = function(){
	
	var widget = $("#template .bill").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	
	this.set = function(val){
		widget.find('label').text(this.get(val.label));
		widget.data('name', val.name);
		
		for(var i=0;i<val.options.length;i++) {
			var option = $( "<p>", {
			      "class": "bill-option"
			    }).appendTo( widget.find(".bill-list"));
			$("<input>", {"type" : "radio"})
				.attr('id', val.options[i].value)
				.data('value', val.options[i].value)
				.data('amount', val.options[i].amount)
				.attr('name', val.name).appendTo(option)
				.attr('class', 'big-radio')
				.click(function(){
					widget.data('value', $(this).data().value);
					widget.data('amount', $(this).data().amount);
				});
			$("<label>")
				.text(val.options[i].label != "" ? val.options[i].label : "　")
				.attr('for', val.options[i].value)
				.appendTo(option)
				.attr('class', 'bill-option-label');
		}
//		alert($(".bill .bill-list").html());
	}
}

FormBuilder.datemonth = function(){
	var widget = $("#template .datemonth").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	this.set = function(val) {
		widget.find('label').text(this.get(val.label));
		widget.data('name', val.name);
		var year = new Date().getFullYear();
		$("<option>").attr('value', year).text(year).appendTo(widget.find('.year'));
		$("<option>").attr('value', year-1).text(year-1).appendTo(widget.find('.year'));
		if(val.value != null){
			widget.find(".year").attr('value',val.value.substring(0,4));
			widget.find(".month").attr('value',val.value.substring(4,6));
		}
		
		// set init value
		var date = widget.find('.year').val() + widget.find('.month').val();
		widget.data('value', date);
		widget.data('label', this.get(val.label));//site本地使用
		/****************************/
		var month = (new Date().getMonth() + 1).toString();
		if(month.length == 1){
			month = '0'+month;
		}
		/***************************/

		$('.year, .month').change(function(){
			var date = widget.find('.year').val() + widget.find('.month').val();
			widget.data('value', date);
		});

		// 设置月份初始值
		$('.biz-content .month option').each(function(){
			if (this.value == month)
				this.selected = 'selected';
		});
		$('.year, .month').change();
	}
}

//upmp规范使用，全渠道用不到
FormBuilder.verifycode = function(){
	var widget = $("#template .verifycode").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	this.set = function(val){
		widget.data('name',val.name);
		widget.data('vid', val.vid);
		widget.find('input[type=text]').width(50);
		widget.find('#vid').val(val.vid);
		widget.find('img').attr('src',G_CONF.img_code_url + 'vid=' + G_CONF.img_code_vid).click(function(){
			$(this).attr('src', $(this).attr('src'));
		});
		
		widget.find('input[type=text]').blur(function(){
			widget.data('value', $(this).val());
		});
	}
}

FormBuilder.single = function(){

	var widget = $("#template .single").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	this.set = function(val){
		widget.find('label').text(this.get(val.label));
		widget.data('name', val.name);
		var select = widget.find('select').attr('name', val.name);
		for(var i=0;i<val.options.length;i++) {
			$("<option>").attr('value', val.options[i].value).text(val.options[i].label).appendTo(select);
		}
		
		// set init value
		widget.data('value', select.val());
		select.change(function(){
			widget.data('value', select.val());
		});
	}
}

FormBuilder.button = function(){
	
	widget = $("#template .button").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	
	this.set = function(val){
		widget.find("input[type='submit']").val(val.label);
		widget.data('name', val.name);
		widget.data('value', val.value);
		
		widget.bind('click', {action : val.action, name : val.name, value: val.value}, clickButton);
	}
}

FormBuilder.multibillstring = function(){
	
	var widget = $("#template .multibillstring").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	
	this.set = function(val){
		widget.find('label').text(this.get(val.label))
			.attr("class", "multibill-title");
			
		var txnAmt = 0;

		var optionUl = $("<ul>")
			.appendTo( widget.find(".bill-list"));

		for(var i=0;i<val.options.length;i++) {
			
			txnAmt += val.options[i].amount * 1.0;
			var optionLi = $("<Li>")
					.appendTo( optionUl);
			$("<div>")
				.appendTo(optionLi)
				.text(val.options[i].label)
				.attr("class", "multibill-label");

			var detailUl = $("<ul>")
				.appendTo(optionLi);
	
			for (var j=0; j<val.options[i].detail.length; j++ ){

				var detailLi = $("<li>")
					.appendTo(detailUl);
				
				$("<div>")
					.appendTo(detailLi)
					.text(val.options[i].detail[j].label != "" ? val.options[i].detail[j].label : "　" )
					.attr("class", "multibill-detail-label");
				
				$("<div>")
					.appendTo(detailLi)
					.text(val.options[i].detail[j].value ? val.options[i].detail[j].value : "　" );
			}
		}
		widget.data('amount', txnAmt);
//		alert($(".multibillstring").html());
	}
}

FormBuilder.singlebill = function(){
	
	var widget = $("#template .singlebill").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	
	this.set = function(val){
		
		widget.find('label')
			.text(this.get(val.label))
			.attr("class", "multibill-title");
		widget.data('name', val.name != undefined? val.name : "bill_id"); //防止迷一样的没给name
		
		var optionUl = $("<ul>")
			.appendTo( widget.find(".bill-list"));

		for(var i=0;i<val.options.length;i++) {
			
			var optionLi = $("<Li>")
					.appendTo( optionUl);

			var radio = $("<input>", {"type" : "radio"})
				.appendTo(optionLi)
				.attr('id', val.options[i].value)
				.data('value', val.options[i].value)
				.data('amount', val.options[i].amount)
				.attr('name', val.name != undefined? val.name : "bill_id")
				.attr('class', 'big-radio')
				.click(function(){
					widget.data('value', $(this).data().value);
					widget.data('amount', $(this).data().amount);
				});
			
			if( val.options[i].disable === "0" ){
				radio.attr("disabled", "disabled");
			}
			
			$("<label>")
					.appendTo(optionLi)
					.text(val.options[i].label != "" ? val.options[i].label : "　")
					.attr('for', val.options[i].value)
					.attr('class', 'bill-option-label');

			var detailUl = $("<ul>")
				.appendTo(optionLi);
	
			for (var j=0; j<val.options[i].detail.length; j++ ){

				var detailLi = $("<li>")
					.appendTo(detailUl);
				
				$("<div>")
					.appendTo(detailLi)
					.text(val.options[i].detail[j].label != "" ? val.options[i].detail[j].label : "　" )
					.attr("class", "multibill-detail-label");
				
				$("<div>")
					.appendTo(detailLi)
					.text(val.options[i].detail[j].value ? val.options[i].detail[j].value : "　" );
			}
		}
//		alert($(".singlebill").html());
	}
}

FormBuilder.multibill = function(){
	
	var widget = $("#template .multibill").first().clone();
	widget.appendTo(G_CONF.bizcontent);
	
	this.set = function(val){
		
		widget.find('label')
			.text(this.get(val.label))
			.attr("class", "multibill-title");
		widget.data('name', val.name);
		
		var optionUl = $("<ul>")
			.appendTo( widget.find(".bill-list"));

		for(var i=0;i<val.options.length;i++) {
			
			var optionLi = $("<li>")
					.appendTo( optionUl);

			$("<input>", {"type" : "checkbox"})
				.appendTo(optionLi)
				.attr('id', val.options[i].value)
				.data('value', val.options[i].value)
				.data('amount', val.options[i].amount)
				.attr('name', val.name)
				.attr('class', 'big-checkbox')
//				.click(function(){
//					var amount = 0;
//					var mbill = new Array();
//					var k = 0;
//					widget.find("input[type='checkbox']:checked").each(function(){
//					    amount += $(this).data('amount') * 1.0;
//					    mbill[k++] = $(this).data('value');
//						});
//					widget.data('value', JSON.stringify(mbill));
//					widget.data('amount', amount);
//				});
			
			if( val.options[i].disable === "0" ){
				radio.attr("disabled", "disabled");
			}
			
			$("<label>")
					.appendTo(optionLi)
					.text(val.options[i].label != "" ? val.options[i].label : "　")
					.attr('for', val.options[i].value)
					.attr('class', 'bill-option-label');

			var detailUl = $("<ul>")
				.appendTo(optionLi);
	
			for (var j=0; j<val.options[i].detail.length; j++ ){

				var detailLi = $("<li>")
					.appendTo(detailUl);
				
				$("<div>")
					.appendTo(detailLi)
					.text(val.options[i].detail[j].label != "" ? val.options[i].detail[j].label : "　" )
					.attr("class", "multibill-detail-label");
				
				$("<div>")
					.appendTo(detailLi)
					.text(val.options[i].detail[j].value ? val.options[i].detail[j].value : "　" );
			}
		}
//		alert($(".multibill").html());
	}
}