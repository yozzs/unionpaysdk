<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en">

<!-- 

  借地写说明：
  jquery-ui的说明参考：http://www.runoob.com/jqueryui/jqueryui-tutorial.html
  jquery的说明参考：http://www.w3school.com.cn/jquery/index.asp
  
  tabs-api为横向的标签，下面定义的div比如tabs-purchase是竖向的标签，按已有的往下添加，名字别重复就行。
  
  新增横向标签：
  1. <div id="tabs-api"><ul><li>下面新加个a标签，指向一个锚点。
  2. 上一条的<ul>同级别下新加一个<div>，id使用上一条锚点指定的id。
  
  新增纵向标签：
  1. js加一行，设置纵向标签的参数。
  2. 总之参考已有的样例吧。
  
 缴费的页面需要分开写，因为如果放一起写页面工作会不正常，暂时不了解原因。
  
-->

<head>
  <meta charset="utf-8">
  <title>综合认证服务平台产品示例</title>
  <link rel="stylesheet" href="static/jquery-ui.min.css">
  <link rel="stylesheet" href="static/demo.css">
  <script src="static/jquery-1.11.2.min.js"></script>
  <script src="static/jquery-ui.min.js"></script>
  <script src="static/demo.js"></script>
  <script>
  	$(function() {
       setApiDemoTabs("#tabs-identy");
	  });
  </script>

</head>
<body style="background-color:#e5eecc;">
<div id="wrapper">

<div id="header">
<h2>综合认证服务平台产品示例</h2>

</div>

<div id="tabs-api">
  <ul>
    <li><a href="#tabs-api-1">前言</a></li>
    <li><a href="#tabs-api-2">综合认证服务产品样例</a></li>
    <li><a href="#tabs-api-3">常见开发问题</a></li>
  </ul>
  
  <div id="tabs-api-1">
    <jsp:include  page="/pages/introduction.jsp"/>
  </div>
  
  <div id="tabs-api-3">
   <jsp:include  page="/pages/devlopHelp.jsp"/>
  </div>
  
    <div id="tabs-api-2">
	<div id="tabs-identy" >
	  	<ul >
	    <li><a href="pages/query.jsp">交易状态查询</a></li> 
	    <li><a href="pages/card_identification.jsp">银行卡认证</a></li>
	    <li><a href="pages/card_info_query.jsp">银行卡信息查询</a></li>
	    <li><a href="pages/card_regional_query.jsp">银行卡属地查询</a></li>
	     <li><a href="pages/enterprise_info_identification.jsp">企业信息认证</a></li>
	     
	    <li><a href="pages/enterprise_info_query.jsp">企业信息查询</a></li> 
	    <li><a href="pages/enterprise_info_batch_identification.jsp">企业信息批量认证</a></li>
	    <li><a href="pages/enterprise_info_batch_query.jsp">企业信息批量认证查询</a></li>
	    <li><a href="pages/face_alignment.jsp">人脸比对</a></li>
	     <li><a href="pages/prevent_hack.jsp">防HACK</a></li>
	     
	     <li><a href="pages/bioassay.jsp">活体检测</a></li> 
	    <li><a href="pages/id_photo_check.jsp">身份证核查及证件照比对</a></li>
	    <li><a href="pages/id_info_check_return_photo.jsp">公民身份证简项认证及返回照片</a></li>
	    <li><a href="pages/mobile_real_name_auth.jsp">移动运营商手机实名认证</a></li>
	     <li><a href="pages/mobile_state_onlinetime_query.jsp">移动运营商手机状态和在网时长查询</a></li>
	     
	     	    <li><a href="pages/sms_code_issued.jsp">短信验证码下发</a></li> 
	    <li><a href="pages/sms_code_verfication.jsp">短信验证码验证</a></li>
	    <li><a href="pages/bioassay_in_order.jsp">活体检测下单</a></li>
	    <li><a href="pages/bank_card_identification_front.jsp">银行卡认证（前台）</a></li>
	     <li><a href="pages/enterprise_info_identification_front.jsp">企业信息认证（前台）</a></li>
	     
	        <li><a href="pages/enterprise_info_query_front.jsp">企业信息查询（前台）</a></li>

       </ul>
	</div>
  </div>
  
  </div> <!-- end of tabs-api-->
</div><!-- end of wrapper-->
 
 
</body>
</html>