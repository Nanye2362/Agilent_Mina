
var config = {

  En: "PRD",
  // 下面的地址配合云端 Server 工作
  //Server: "https://devops.coffeelandcn.cn/",//UAT
  //https://qa.wechat.service.agilent.com/
  //Server:"https://devopsx.coffeelandcn.cn/", //DEV
  //Server: "https://prd.wechat.service.agilent.com/", //PRO
  //https://qa.wechat.service.agilent.com/
  Server:"",
  version: "3.8.16.1",

};
var check = require('/utils/checkVersion.js');
check.checkVersion(config);
module.exports = config
