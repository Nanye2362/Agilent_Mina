var config = require('../config.js');
var util = require('./util.js');
var arrHandle={};
var startRequest=false;
var timeF;

function getWorkStatus(){
  var app = getApp();
  return app.globalData.meiqiaObj;
}

function setWorkStatus(workStatus,canUse){
  var app = getApp();
  var meiqiaObj = { workStatus: workStatus, canUse: canUse};
  app.globalData.meiqiaObj = meiqiaObj;
}

function removeHandleArr(id){
  delete arrHandle[id];
}


function startWorkTime(handle,id){
    var meiqiaObj=getWorkStatus();
  if (typeof (meiqiaObj) =="undefined"){ //是否已检测过
      arrHandle[id]=handle;//没有检测过缓存方法
      checkWorktime(true);//发起检测
    }else{
      handle(meiqiaObj.workStatus, meiqiaObj.canUse);//已检测过直接返回结果
    }
}

function handle(workTimeStatus,canUse){
  console.log(arrHandle);
  for (var key in arrHandle){
    arrHandle[key](workTimeStatus, canUse);
  }
}


var requestTime=0;

function checkWorktime(shLoading = false) {
  var date = new Date();
  var app=getApp();
  if ((startRequest && date.getTime() - requestTime <= 60 * 1000) || !app.globalData.appShow){
    return false;
  }
  
  if(!timeF){
    timeF=setInterval(checkWorktime, 60000);
  }

  startRequest=true;
  requestTime=date.getTime();
  
  util.checkWorktime(function (res) {
    setWorkStatus(res.isworktime, res.meiqia_isWork);
    handle(res.isworktime, res.meiqia_isWork);
    startRequest=false;
    console.log("----chen chektime----");
  },shLoading);
}

function handleWorkTime(isAlert = false) {
  var meiqiaObj = getWorkStatus();
  if (meiqiaObj.canUse){
   
  }
  if (meiqiaObj.workStatus) {
    return true;
  } else {
    if (isAlert) {
      wx.showModal({
        title: '温馨提示',
        content: '感谢您一直以来对我们工作的关注和支持。我们的工作时间是周一至周五的 8:30-17:30，双休日（除节假日外）仅提供紧急电话技术支持，服务时间为：9:00-17:00。',
        showCancel: false
      })
    } else {
      wx.navigateTo({
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