var config = require('../config');
// var urlArr = ["wechat-mini/wx-login", "api/check-lunch"];//未登录可以使用的url
var urlArr = ["api/v1/wechat/login", "api/check-lunch"];//未登录可以使用的url
let ocrServer = "https://ocr.wechat.learn.agilent.com/";
let Server = config.Server; //UAT

var arrRequest = [], isRequesting = false;
var currObj={};

function showLoading(){
  wx.showLoading({
    title: '加载中，请稍候',
    mask: true
  })
}

function NetRequest({ url, data, success, fail, complete, method = "POST", showload = true, host = Server }) {
  var obj = { url: url, data: data, success: success, fail: fail, complete: complete, method: method, showload: showload, host: host };
  if (showload) {
    showLoading();
  }
  var app = getApp();
  console.log("request url" + obj.url);
  console.log("isloagin:" + app.globalData.isLogin);
  console.log("isRequesting:" + isRequesting);
  if (isRequesting || (!app.globalData.isLogin && !in_array(url, urlArr))) {
    var hasUrl=false;
    for (var i in arrRequest){
      if(arrRequest[i].url==obj.url){
        hasUrl=true;
        console.log("this url had waiting."+obj.url);
      }
    }
    if (!hasUrl){
      arrRequest.push(obj);
    }
    console.log(arrRequest);
    return;
  }
  isRequesting = true;
  _NetRequest(obj);
}

function in_array(stringToSearch, arrayToSearch) {
  for (var s = 0; s < arrayToSearch.length; s++) {
    var thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
}

function _NetRequest({ url, data, success, fail, complete, method = "POST", showload = true, host = Server }) {
  currObj = { url: url, data: data, success: success, fail: fail, complete: complete, method: method, showload: showload, host: host };
  var tempUrl = url;
  var app = getApp();

  if (!in_array(url, urlArr) && app.globalData.needCheck) {
    isRequesting = false;

    arrRequest = [];
    return false;
  }

  //都不要下
  // var _csrf = wx.getStorageSync('csrf');
  // var version = config.version;
  // var csrfToken = wx.getStorageSync('csrfCookie')
  // if (typeof (data) == 'object') {
  //   data._csrf = _csrf;
  //   data.version = version;
  // } else {
  //   data = { '_csrf': _csrf, 'version': version };
  // }
//都不要上

  //头请求
  // var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
  // if (session_id != "" && session_id != null) {
  //   var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id + ";" + csrfToken }
  // } else {
  //   var header = { 'content-type': 'application/x-www-form-urlencoded' }
  // }


  //替换成token
  var token = wx.getStorageSync('token');
  if(token != "" && token != null){
    var header = {'content-type': 'application/x-www-form-urlencoded', 'token':'token='+token+';'}
  }else {
    var header = { 'content-type': 'application/x-www-form-urlencoded' }
  }

  url = host + url;

  wx.request({
    url: url,
    method: method,
    data: data,
    header: header,
    success: res => {
      // if ((session_id == "" || session_id == null) && typeof (res.data.session_id) != "undefined") {
      //   console.log(res.data.session_id);
      //   wx.setStorageSync('PHPSESSID', res.data.session_id); //如果本地没有就说明第一次请求 把返回的session id 存入本地

      //   if (typeof (res.data.csrfToken) != 'undefined') {
      //     wx.setStorageSync('csrf', res.data.csrfToken);
      //     wx.setStorageSync('csrfCookie', res.data.csrfCookie);
      //   }
      // }
      //修改为新的登陆方式++++++++++
      if ((token == "" || token == null) && typeof (res.data.token) != "undefined") {
        console.log(res.data.token);
        wx.setStorageSync('token', res.data.token); //如果本地没有就说明第一次请求 把返回的token存入本地

        if (typeof (res.data.openid) != 'undefined') {
          wx.setStorageSync('openid', res.data.openid);
        }
      }
      console.log(res.data);

      if (res.data == "no session") { //未登录
        var aa = getApp();
        isRequesting=false;
        arrRequest.unshift(currObj);
        aa.wxlogin();
        return;
      }

      fail = function () {
          wx.showModal({
            title: '请求失败',
            content: '发生错误，请联系客服。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
      }

      let data = res.data
      res['statusCode'] === 200 ? success(data) : fail(res)
    },
    fail: function (e) {
      wx.hideLoading();
      wx.showModal({
          title: '请求失败',
          content: '请检查您的网络',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log(currObj.showload);
              if (currObj.showload){
                showLoading();
              }
              _NetRequest(currObj);
            }
          }
      })
      return;
    },
    complete: function (res) {
      console.log("complete");
      if (res['statusCode'] === 200){
        if (arrRequest.length == 0) {
          if (!app.globalData.isLoading && !app.globalData.isUploading) {
            wx.hideLoading()
          }
          isRequesting = false;
        }

        if (typeof (complete) == 'function') {
          complete();
        }

        if (arrRequest.length != 0) {
            var obj = arrRequest.shift();
            _NetRequest(obj);
        }
      }
    }
  })
}




module.exports = {
  NetRequest: NetRequest,
  ocrServer: ocrServer
}
