─────────────────────────────────────────     
产品名称：银联综合认证服务平台产品
JDK：  本示例JDK版本基于jdk1.6.12u5以上建议1.6.26
日期：  2017-11-16
─────────────────────────────────────────
───────────
 **重要**
1） 联调前请仔细阅读以下说明
2） 此工程可以跑起来测试，建议使用IE，chrome打开
3) 测试界面中的交易时一定要先配置好私钥签名证书，验签公钥证书。

 全渠道代收产品消费交易示例地址为：http://IP：端口/ACPSample_Identification/index.jsp
───────────

───────────
示例工程目录结构
───────────

ACPSample_JF
  │
  ├src┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈类文件夹
  │  │
  │  ├assets ┈┈┈┈┈┈┈┈┈相关资源目录
  │  │  │  
  │  │  ├apache_httpclient┈┈┈┈┈┈┈┈┈apache中的http post方法 
  │  │  │
  │  │  ├测试环境配置文件
  │  │  │   │  
  │  │  │   ├acp_sdk.properties.密钥 ┈┈┈┈┈┈┈┈┈ 【重要】 测试环境配置文件样例（密钥方式签名）（使用方式请看文件里的说明）
  │  │  │   │
  │  │  │   └acp_sdk.properties.证书 ┈┈┈┈┈┈┈┈┈【重要】 测试环境配置文件样例（证书方式签名）（使用方式请看文件里的说明）    
  │  │  │
  │  │  ├测试环境证书
  │  │  │   │
  │  │  │   ├acp_test_enc.cer ┈┈┈┈┈┈┈┈┈ 【重要】测试环境敏感信息加密证书（所有商户固定使用同一个）  
  │  │  │   │  
  │  │  │   ├acp_test_sign.pfx ┈┈┈┈┈┈┈┈┈ 【重要】 测试环境签名私钥证书（所有商户固定使用同一个）
  │  │  │   │  
  │  │  │   ├acp_test_root.cer ┈┈┈┈┈┈┈┈┈ 【重要】 测试环境验签公钥证书根证书  （所有商户固定使用同一个） 
  │  │  │   │
  │  │  │   └acp_test_middle.cer ┈┈┈┈┈┈┈┈┈【重要】 测试环境验签公钥证书中级证书  （所有商户固定使用同一个）  
  │  │  │  
  │  │  ├收单机构接入需做改动 
  │  │  │   │
  │  │  │   ├acp_test_sign_inst.pfx ┈┈┈┈┈┈┈┈┈【重要】 收单机构接入的测试环境签名私钥证书（所有机构固定使用同一个）
  │  │  │   │
  │  │  │   └机构接入需做改动.txt 
  │  │  │  
  │  │  ├生产环境配置文件
  │  │  │   │
  │  │  │   ├acp_sdk.properties.密钥 ┈┈┈┈┈┈┈┈┈ 【重要】 生产环境配置文件样例（密钥方式签名）（使用方式请看文件里的说明）
  │  │  │   │
  │  │  │   └acp_sdk.properties.证书 ┈┈┈┈┈┈┈┈┈【重要】 生产环境配置文件样例（证书方式签名）（使用方式请看文件里的说明）
  │  │  │
  │  │  └生产环境证书
  │  │     │
  │  │     ├acp_prod_enc.cer┈┈┈┈┈┈┈┈┈【重要】 生产环境敏感信息加密证书（所有商户固定使用同一个）
  │  │     │
  │  │     ├acp_prod_root.cer ┈┈┈┈┈┈┈┈┈【重要】 生产环境验签公钥根证书  （所有商户固定使用同一个）  
  │  │     │
  │  │     └acp_prod_middle.cer ┈┈┈┈┈┈┈┈┈【重要】 生产环境验签公钥中级证书  （所有商户固定使用同一个）  
  │  │  
  │  ├com.unionpay.acp.demo
  │  │  │
  │  │	├BackRcvResponse.java  ┈┈┈┈┈┈┈┈┈ 后台通知处理示例类
  │  │  │   
  │  │  ├DemoBase.java┈┈┈┈┈基础类
  │  │  │
  │  │  ├EncryptCerUpdateQuery.java┈┈┈┈┈加密证书更新示例类（后台）
  │  │  │  	
  │  │  ├Form_5_2_Query.java┈┈┈┈┈交易状态查询（后台）
  │  │  │    
  │  │  ├Form_5_3_Card_Identification.java┈┈┈┈┈银行卡认证 （后台）
  │  │  │  
  │  │  ├Form_5_4_Card_Info_Query.java┈┈┈┈┈银行卡信息查询 （后台）
  │  │  │  
  │  │  ├Form_5_5_Card_Regional_Query.java┈┈┈┈┈银行卡属地查询 （后台）
  │  │  │  
  │  │  ├Form_5_6_Enterprise_Info_Identification.java┈┈┈┈┈企业信息认证 （后台）
  │  │  │  
  │  │  ├Form_5_7_Enterprise_Info_Query.java┈┈┈┈┈企业信息查询 （后台）
  │  │  │  
  │  │  ├Form_5_8_Enterprise_Info_Batch_Identification.java┈┈┈┈┈企业信息批量认证 （后台）
  │  │  │ 	
  │  │  ├Form_5_9_Enterprise_Info_Batch_Query.java┈┈┈┈┈企业信息批量认证查询（后台）
  │  │  │    
  │  │  ├Form_5_10_Face_Alignment.java┈┈┈┈┈人脸比对 （后台）
  │  │  │  
  │  │  ├Form_5_11_Prevent_Hack.java┈┈┈┈┈防HACK（后台）
  │  │  │  
  │  │  ├Form_5_12_Bioassay.java┈┈┈┈┈活体检测 （后台）
  │  │  │  
  │  │  ├Form_5_13_ID_Photo_Check.java┈┈┈┈┈身份证核查及证件照比对 （后台）
  │  │  │  
  │  │  ├Form_5_14_ID_Info_Check_Return_Photo.java┈┈┈┈┈公民身份证简项认证并返回照片 （后台）
  │  │  │  
  │  │  ├Form_5_15_Mobile_Real_Name_Auth.java┈┈┈┈┈移动运营商手机实名认证 （后台）  
  │  │  │  
  │  │  ├Form_5_16_Mobile_State_Online_Query.java┈┈┈┈┈移动运营商手机状态和在网时长查询 （后台）
  │  │  │ 	
  │  │  ├Form_5_17_SMS_Code_Issued.java┈┈┈┈┈短信验证码下发（后台）
  │  │  │    
  │  │  ├Form_5_18_SMS_Code_Verfication.java┈┈┈┈┈短信验证码验证 （后台）
  │  │  │  
  │  │  ├Form_5_19_Bioassay_In_Order.java┈┈┈┈┈下单（防HACK） （后台）
  │  │  │  
  │  │  ├Form_5_20_Bank_Card_Identification_Front.java┈┈┈┈┈退货交易示例类 （前台）
  │  │  │  
  │  │  ├Form_5_21_Enterprise_Info_Identification_Front.java┈┈┈┈┈冲正交易示例类 （前台）
  │  │  │  
  │  │  ├Form_5_22_Enterprise_Info_Query_Front.java┈┈┈┈┈交易状态查询示例类 （前台） 
  │  │  │
  │  │  └多个商户号各自使用自己的私钥证书（多证书）使用方法.txt    
  │  │  
  │  ├com.unionpay.acp.sdk
  │  │  │
  │  │  ├AcpService.java┈┈┈┈┈┈全渠道 SDK API类
  │  │  │
  │  │  ├CertUtil.java┈┈┈┈┈┈证书处理工具类
  │  │  │
  │  │  ├HttpClient.java┈┈┈┈┈后台交易http post通讯类，如果要使用代理访问或者产生了问题那么可以自行解决或者使用apache httpClient
  │  │  │
  │  │  ├LogUtil.java┈┈┈┈┈日志工具类
  │  │  │
  │  │  ├SDKConfig.java┈┈┈┈┈┈┈读取acp_sdk.properties属性文件并填装配置的属性的配置类
  │  │  │  
  │  │  ├SDKConstants.java┈┈┈┈┈┈┈常量类
  │  │  │    
  │  │  ├SDKUtil.java┈┈┈┈┈┈┈SDK工具类
  │  │  │   
  │  │  ├SecureUtil.java┈┈┈┈┈┈┈安全相关工具类
  │  │  │   
  │  │  └SM3Digest.java┈┈┈┈┈┈┈sm3算法工具类
  │  │
  │  └web ┈┈┈┈┈┈┈┈┈ web相关类
  │      │
  │      ├AutoLoadServlet.java ┈┈┈┈┈┈初始化读取acp_sdk.properties初始化请求银联地址，证书等相关资源的servlet
  │      │
  │      └CharsetEncodingFilter.java ┈┈┈┈web请求编码过滤器
  │
  ├acp_sdk.properties ┈┈┈┈【重要】测试环境配置文件，请求银联地址，私钥签名证书，验签公钥路径，多证书的配置文件（这个文件切换生产的时候要替换成生产环境的配置文件）
  │
  ├log4j.properties ┈┈┈┈LogUtil.java日志工具类的配置文件
  │
  ├WebContent ┈┈┈┈┈┈┈┈┈┈┈┈┈┈页面文件夹
  │  │
  │  ├index.jsp ┈┈┈┈┈┈┈┈┈调试入口页面
  │  │  
  │  └WEB-INF
  │   	  │
  │       └lib（如果JAVA项目中包含这些架包，则不需要导入）
  │   	     │
  │   	     ├bcprov-jdk15on-1.54.jar---------注意包名后缀版本，低版本的bc包不支持sdk使用的部分方法
  │   	     │
  │   	     ├commons-codec-1.6.jar
  │   	     │
  │   	     ├commons-io-2.2.jar
  │   	     │
  │   	     ├commons-lang-2.5.jar
  │   	     │
  │   	     ├log4j-1.2.17.jar
  │   	     │
  │   	     ├slf4j-api-1.5.11.jar
  │   	     │
  │   	     └slf4j-log4j12-1.5.11.jar
  │
  └readme.txt ┈┈┈┈┈┈┈┈┈使用说明文本

───────────
 **注意**

1.【接口规范】该接口参考文档位置：
      接口产品规范：open.unionpay.com帮助中心 下载  产品接口规范  《缴费产品接口规范》
      应答码规范：《平台接入接口规范-第5部分-附录》
      
2.【关于商户号】开发包中使用的商户号777290058110048只能在入网测试环境使用；
      可以先使用这个商户调通交易【注意：不要使用open上自己注册的777开头的商户号测试代收产品，自己注册的商户号不支持此产品】
      正式线上环境请使用申请的正式商户号，并确保商户号有对应的权限，如果报了无此交易权限等错误，请联系您申请接入银联的业务人员确认您做的交易是否开通了对应的权限。
 
3.【关于配置文件】
      配置文件在src/assets文件夹下可以找到，src下面默认使用的是测试环境使用证书方式签名的配置文件。请按配置文件中的说明进行修改。
      使用证书方式签名时需要配置证书路径，证书文件除了生产环境的签名证书需要业务邮件发送下载方式下载，其余证书均在src/assets文件夹下面有提供，需要复制到配置文件配置的路径。
      使用密钥方式签名时，测试环境密钥88888888，生产环境密钥由业务邮件发送。

4.测试过程中的如果遇到疑问或问题您可以：
  1）优先在open平台中查找答案：
  	 调试过程中的问题或其他问题请在 https://open.unionpay.com/ajweb/help/faq/list 帮助中心 FAQ 搜索解决方案
             测试过程中产生的7位应答码问题疑问请在https://open.unionpay.com/ajweb/help/respCode/respCodeList 输入应答码搜索解决方案
  2）测试环境测试支付请使用测试卡号测试， FAQ搜索“测试卡”。
  3）切换生产环境要点请FAQ搜索“切换”。
  
5.【生产环境问题】连接银联生产环境测试遇到的问题 如果通过open平台无法解决 请登陆merchant.unionpay.com 菜单"服务单管理"->"创建服务单"请求排查问题。

6. 如需使用控件支付，控件请在控件产品开发包中下载，只看里面的控件本身的内容，里面后台开发包的内容为消费的，不用看。


