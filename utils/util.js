var config = require('../config');
var request = require('request');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let Server = config.Server; //UAT

function uploadImg(urlList,callback){
  var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
  if (session_id != "" && session_id != null) {
    var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id }
  } else {
    var header = { 'content-type': 'application/x-www-form-urlencoded' }
  }

  //console.log(session_id);
  var url = Server + "api/upload-img";
  var completeNum=0;
  var returnUrlList=[];
  for (var i in urlList){
    wx.uploadFile({
      url: url,
      filePath: urlList[i],
      name: 'img',
      formData:{
          key:i
      },
      header: header,
      success:function(res){
        completeNum++;
        var obj = JSON.parse(res.data);
        returnUrlList[obj.key] = obj.url;
        if (urlList.length == completeNum) {
          callback(returnUrlList);
        }
      },
      fail: function (e) {
        fail();
      },
      complete: function () {
        //wx.hideLoading()
      }
    })
  }
}


//判断是否绑定,true为绑定，false为未绑定
function IsCertificate(success,fail){
  request.NetRequest({
    url: 'auth/check-bind',
    success: function (res) {
      if (res.success == true) {
        success();
      } else {
        fail();
      }
    }
  })
}

//判断是否为工作时间,true为是工作时间，false为非工作时间
function checkWorktime(callBack, showload=true) {
  var reauestFail;
  if (!showload){ //如果为false，基于后台请求，如遇网络错误不弹框提示
    reauestFail=function(){
      console.log("request fail");
    }
  }
  console.log(showload);
  request.NetRequest({
    url: 'util/get-worktime',
    showload: showload,
    success: function (res) {
      callBack(res);
    },
    fail: reauestFail
  });
}

function checkEmpty(obj,arrInput){
  var isEmpty=false;
  for (var i in arrInput){
    if (obj[arrInput[i]].trim().length==0){
      isEmpty=true;
      return isEmpty;
    }
  }
  return isEmpty;
}

function getUserInfo(cb){
  var user=wx.getStorageSync('userInfo');
  if (user==""){//user不存在
    request.NetRequest({
      url: "api/get-userinfo", success: function (res) {
        if (res.success) {
          user = res.info;
          wx.setStorageSync('userInfo',user);
          cb(user);
        } else {
          wx.showModal({
            title: '发生错误',
            content: '加载失败',
            showCancel: false
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '发生错误',
          content: '加载失败',
          showCancel: false
        })
      }
    });
  }else{
    cb(user);
  }
}

function backHome(){
  console.log('backHome')
  wx.switchTab({
    url: '../index/index',
  })
}

//检测是否存在，如存在就调用返回，不存在就直接跳转
function chen_navigateTo(name,url){
    var pages=getCurrentPages();
    var backPageNum=0;
    for(var i in pages){
      if (pages[i].route == name){
        backPageNum=pages.length-1-i;
          break;
       }
    }

    if(backPageNum>0){
      wx.navigateBack({
        delta: backPageNum
      })
    }else{
      wx.navigateTo({
          url:url
      })
    }
}

function submitFormId(formId){
  if (formId.length == 0 || formId =="the formId is a mock one"){
    return false;
  }
  let url=Server+"wechat-mini/save-formid";
  var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
  var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id}
  wx.request({
    url: url,
    method: "POST",
    data: { formId:formId},
    header: header
  })
}

module.exports = {
  formatTime: formatTime,
  NetRequest: request.NetRequest,
  IsCertificate: IsCertificate,
  Server: Server,
  ocrServer: request.ocrServer,
  uploadImg: uploadImg,
  checkEmpty: checkEmpty,
  getUserInfo: getUserInfo,
  checkWorktime: checkWorktime,
  backHome: backHome,
  chen_navigateTo: chen_navigateTo,
  submitFormId:submitFormId
}
