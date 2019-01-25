<%@ page language="java" contentType="text/html; charset=UTF-8"  import="java.text.*" import="java.util.*" 
    pageEncoding="UTF-8"%>

<form class="api-form" method="post" action="<%request.getContextPath();%>/ACPSample_Identification/form_5_3_Card_Identification" target="_blank">
<p>
<label>商户号：</label>
<input id="merId" type="text" name="merId" placeholder="填写被查询交易的商户号" value="" title="默认商户号仅作为联调测试使用，正式上线还请使用正式申请的商户号"  required="required"/>
</p>
<p>
<label>订单发送时间：</label>
<input id="txnTime" type="text" name="txnTime" placeholder="填写被查询交易的订单发送时间" value="" title="填写被查询交易的订单发送时间，YYYYMMDDhhmmss格式" required="required"/>
</p>
<p>
<label>商户订单号：</label>
<input id="orderId" type="text" name="orderId" placeholder="填写被查询交易的商户订单号" value="" title="填写被查询交易的商户订单号" required="required"/>
</p>
<p>
<label>卡号：</label>
<input id="accNo" type="text" name="accNo" placeholder="卡号" value="6221558812340000" title="需要认证的银行卡号 " required="required"/>
</p>
<p>
<label>CVN2：</label>
<input id="cvn2" type="text" name="cvn2" placeholder="CVN2（贷记卡时上送）" value="" title="卡背面的cvn2三位数字"/>
</p>
<p>
<label>有效期：</label>
<input id="expired" type="text" name="expired" placeholder="有效期（贷记卡时上送）" value="" title="有效期 年在前月在后 " />
</p>
<p>
<label>&nbsp;</label>
<input type="submit" class="button" value="提交" />
<input type="button" class="showFaqBtn" value="遇到问题？"  />
</p>
</form>

<div class="question" >
<hr />
<h4>银行卡认证您可能会遇到...</h4>
<p class="faq">
<br><br>
</p>
<hr />
 <jsp:include  page="/pages/more_faq.jsp"/>
</div>

