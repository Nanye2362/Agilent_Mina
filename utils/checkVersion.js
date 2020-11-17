// 检测版本的通用方法
function checkVersion(config) {
  if (config.En == "QA") {
    config.Server = "https://qa.wechat.service.agilent.com/";
    //https://qa.wechat.service.agilent.com/
    // https://www.tst.kakao.service.agilent.com/
    config.elearningAppid = "wx4026dcacf268c5b2";
    config.sobotUrl = "https://agilent.sobot.com/chat/h5/v2/index.html?";
    config.sobotSysnum = "7b4a15f795d544228651e8e7eb617fb3";
  } else if (config.En == 'STG') {
    config.Server = "https://stg.wechat.service.agilent.com/";
    config.elearningAppid = "wx4026dcacf268c5b2";
    config.sobotUrl = "https://agilent.sobot.com/chat/h5/v2/index.html?";
    config.sobotSysnum = "7b4a15f795d544228651e8e7eb617fb3";
  } else {
    config.Server = "https://prd.wechat.service.agilent.com/";
    config.elearningAppid = "wx6907f6b39946942d";
    config.sobotUrl = "https://agilentv2.sobot.com/chat/h5/v2/index.html?";
    config.sobotSysnum = "8aa9f78cce814a9eb2aa76189e6a84a9";
  }
}

module.exports = { checkVersion: checkVersion }