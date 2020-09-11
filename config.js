var config = {

  En: "STG",
  // 下面的地址配合云端 Server 工作
  //Server: "https://devops.coffeelandcn.cn/",//UAT
  //https://qa.wechat.service.agilent.com/
  //Server:"https://devopsx.coffeelandcn.cn/", //DEV
  //Server: "https://prd.wechat.service.agilent.com/", //PRO
  //https://qa.wechat.service.agilent.com/
  //Server:"",
  version: "3.8.16.1",

};

if (config.En =="DEV"){
  config.Server ="https://qa.wechat.service.agilent.com/";
  //https://qa.wechat.service.agilent.com/
  // https://www.tst.kakao.service.agilent.com/
  config.elearningAppid = "wx4026dcacf268c5b2";
}else if (config.En == 'STG') {
  config.Server = "https://stg.wechat.service.agilent.com/";
  config.elearningAppid = "wx4026dcacf268c5b2";
} else{
  config.Server = "https://prd.wechat.service.agilent.com/";
  config.elearningAppid = "wx6907f6b39946942d";
}

module.exports = config
