var config = {

  En: "PRO",
  // 下面的地址配合云端 Server 工作
  //Server: "https://devops.coffeelandcn.cn/",//UAT
  //https://qa.wechat.service.agilent.com/
  //Server:"https://devopsx.coffeelandcn.cn/", //DEV
  //Server: "https://prd.wechat.service.agilent.com/", //PRO
  //https://qa.wechat.service.agilent.com/
  //Server:"",
  version: "3.4.19.1",

};

if (config.En =="DEV"){
  config.Server ="https://devops.coffeelandcn.cn/";
}else{
  config.Server = "https://prd.wechat.service.agilent.com/";
}

module.exports = config