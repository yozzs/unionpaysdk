package com.unionpay.acp.demo;

import com.unionpay.acp.sdk.CertUtil;
import com.unionpay.acp.sdk.LogUtil;
import com.unionpay.acp.sdk.SDKConfig;
import com.unionpay.acp.sdk.SDKUtil;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchProviderException;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * 对控件给商户APP返回的应答信息验签，前段请直接把string型的json串post上来
 * 声明：以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己需要，按照技术文档编写。该代码仅供参考，不提供编码，性能，规范性等方面的保障<br>
 */
public class VerifyAppData extends HttpServlet {

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init();
		SDKConfig.getConfig().loadPropertiesFromSrc();
		CertUtil.getSignCertId(); // 触发CertUtil加载BC
		this.initAppVerifyPubKey();
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		//struts如果读不到输入的话,前段试试修改post时的content-type为text/html
		String jsonData = new String (IOUtils.toByteArray(req.getInputStream()), DemoBase.encoding);
		//resp.getWriter().write(jsonData);
		LogUtil.writeLog("控件应答信息验签处理开始：[" + jsonData + "]");
		boolean result = this.validateAppResponse(jsonData, DemoBase.encoding);
		resp.getWriter().write(result?"true":"false");
		LogUtil.writeLog("控件应答信息验签" + (result?"成功":"失败"));
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	private PublicKey appVerifyPubKey = null;
	
	private void initAppVerifyPubKey() {
		FileInputStream in = null;
		try {
			in = new FileInputStream("d:/certs/acp_test_app_verify_sign.cer");//TODO，这个是测试环境的证书，切换生产需要改生产证书。
			CertificateFactory cf = CertificateFactory.getInstance("X.509", "BC");
			X509Certificate x509 = (X509Certificate) cf.generateCertificate(in);
			appVerifyPubKey = x509.getPublicKey();
			LogUtil.writeLog("init appVerifyPubKey succeed");
		} catch (CertificateException e) {
			LogUtil.writeErrorLog("LoadVerifyCert Error", e);
		} catch (FileNotFoundException e) {
			LogUtil.writeErrorLog("LoadVerifyCert Error File Not Found", e);
		} catch (NoSuchProviderException e) {
			LogUtil.writeErrorLog("LoadVerifyCert Error No BC Provider", e);
		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					LogUtil.writeErrorLog(e.toString());
				}
			}
		}
	}

	/**
	 * 对控件支付成功返回的结果信息中data域进行验签（控件端获取的应答信息）<br>
	 * @param jsonData json格式数据，例如：{"sign" : "J6rPLClQ64szrdXCOtV1ccOMzUmpiOKllp9cseBuRqJ71pBKPPkZ1FallzW18gyP7CvKh1RxfNNJ66AyXNMFJi1OSOsteAAFjF5GZp0Xsfm3LeHaN3j/N7p86k3B1GrSPvSnSw1LqnYuIBmebBkC1OD0Qi7qaYUJosyA1E8Ld8oGRZT5RR2gLGBoiAVraDiz9sci5zwQcLtmfpT5KFk/eTy4+W9SsC0M/2sVj43R9ePENlEvF8UpmZBqakyg5FO8+JMBz3kZ4fwnutI5pWPdYIWdVrloBpOa+N4pzhVRKD4eWJ0CoiD+joMS7+C0aPIEymYFLBNYQCjM0KV7N726LA==",  "data" : "pay_result=success&tn=201602141008032671528&cert_id=68759585097"}
	 * @return 是否成功
	 */
	private boolean validateAppResponse(String jsonData, String encoding) {
		
		if (SDKUtil.isEmpty(encoding)) {
			encoding = "UTF-8";
		}

        Pattern p = Pattern.compile("\\s*\"sign\"\\s*:\\s*\"([^\"]*)\"\\s*");
		Matcher m = p.matcher(jsonData);
		if(!m.find()) {
			LogUtil.writeErrorLog("内容不正确。");
			return false;
		}
		String sign = m.group(1);

		p = Pattern.compile("\\s*\"data\"\\s*:\\s*\"([^\"]*)\"\\s*");
		m = p.matcher(jsonData);
		if(!m.find()) {
			LogUtil.writeErrorLog("内容不正确。");
			return false;
		}
		String data = m.group(1);

		try {
			MessageDigest md = null;
			md = MessageDigest.getInstance("SHA-1");
			md.reset();
			md.update(data.getBytes(encoding));
			byte[] bs = md.digest();
			StringBuffer sb = new StringBuffer();
			for (byte b : bs) { 
			     String hex = Integer.toHexString(b & 0xFF); 
			     if (hex.length() == 1) { 
			       hex = '0' + hex; 
			     }
			     sb.append(hex);
			}
			Signature st = Signature.getInstance("SHA1withRSA", "BC");
			st.initVerify(this.appVerifyPubKey);
			st.update(sb.toString().toLowerCase().getBytes(encoding));
			return st.verify(Base64.decodeBase64(sign));
		} catch (Exception e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		} 
		return false;
	}
}