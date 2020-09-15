// 检测版本的通用方法
function checkVersion(config) {
  if (config.En == "DEV") {
    config.Server = "https://qa.wechat.service.agilent.com/";
    //https://qa.wechat.service.agilent.com/
    // https://www.tst.kakao.service.agilent.com/
    config.elearningAppid = "wx4026dcacf268c5b2";
  } else if (config.En == 'STG') {
    config.Server = "https://stg.wechat.service.agilent.com/";
    config.elearningAppid = "wx4026dcacf268c5b2";
  } else {
    config.Server = "https://prd.wechat.service.agilent.com/";
    config.elearningAppid = "wx6907f6b39946942d";
  }
}

module.exports = { checkVersion: checkVersion }