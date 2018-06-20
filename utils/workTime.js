var config = require('../config.js');
var util = require('./util.js');
var arrHandle={};
var startRequest=false;

function getWorkStatus(){
  var app = getApp();
  return app.globalData.workStatus;
}

function setWorkStatus(workStatus){
  var app = getApp();
  app.globalData.workStatus = workStatus;
}

function removeHandleArr(id){
  delete arrHandle[id];
}


function startWorkTime(handle,id){
    var isWorkTime=getWorkStatus();
    if (typeof (isWorkTime) =="undefined"){ //是否已检测过
      arrHandle[id]=handle;//没有检测过缓存方法
      checkWorktime(true);//发起检测
    }else{
      handle(isWorkTime);//已检测过直接返回结果
    }
}

function handle(workTimeStatus){
  console.log(arrHandle);
  for (var key in arrHandle){
    arrHandle[key](workTimeStatus);
  }
}

function checkWorktime(shLoading = false) {
  if (startRequest){
    return false;
  }
  startRequest=true;
  var date = new Date();
  console.log("time" + console.log(date.toTimeString()));
  util.checkWorktime(function () {
    setWorkStatus(true);
    handle(true);
    startRequest=false;
    console.log("----chen chektime----");
    setTimeout(checkWorktime, 60000);
  }, function () {
    setWorkStatus(false);
    handle(false);
    console.log("----chen chektime----");
    startRequest = false;
    setTimeout(checkWorktime, 60000);
  }, shLoading);
}

function handleWorkTime(isAlert = false) {
  var isWorkTime = getWorkStatus();
  if (isWorkTime) {
    return true;
  } else {
    if (isAlert) {
      wx.showModal({
        title: '温馨提示',
        content: '感谢您一直以来对我们工作的关注和支持。我们的工作时间是周一至周五的 8:30-17:30，双休日（除节假日外）仅提供紧急电话技术支持，服务时间为：9:00-17:00。',
        showCancel: false,
        success: function (res) {

        }
      })
    } else {
      wx.redirectTo({
        url: '../leave_message/leave_message',
      })
    }
  }
}

module.exports = {
  startWorkTime: startWorkTime,
  handleWorkTime: handleWorkTime,
  removeHandleArr: removeHandleArr
}