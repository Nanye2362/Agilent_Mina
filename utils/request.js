
var urlArr = ["api/v1/wechat/login", "api/v1/check-lunch","check-version"];//未登录可以使用的url
let ocrServer = "https://ocr.wechat.learn.agilent.com/";


var arrRequest = [], isRequesting = false;
var currObj = {};

function showLoading() {
  wx.showLoading({
    title: '加载中，请稍候',
    mask: true
  })
}
function clearRequestArr() {
  wx.hideLoading();
  isRequesting = false;
  arrRequest = [];
}

function NetRequest({ url, data, success, fail, complete, method = "POST", showload = true, host = ''}) {
  var obj = { url: url, data: data, success: success, fail: fail, complete: complete, method: method, showload: showload, host: host };
  // console.log(obj);
  // console.log(data);
  if (showload) {
    showLoading();
  }
  var app = getApp();
  console.log("request url：" + obj.url);
  console.log("isloagin:" ,app);
  console.log("isRequesting:" , isRequesting,!in_array(url, urlArr));
  if (isRequesting || (!app.globalData.isLogin && !in_array(url, urlArr))) {
    var hasUrl = false;
    for (var i in arrRequest) {
      if (arrRequest[i].url == obj.url) {
        hasUrl = true;
        console.log("this url had waiting." + obj.url);
      }
    }
    if (!hasUrl) {
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

function _NetRequest({ url, data, success, fail, complete, method = "POST", showload = true, host = '' }) {
  currObj = { url: url, data: data, success: success, fail: fail, complete: complete, method: method, showload: showload, host: host };
  var tempUrl = url;
  let app = getApp();

  if (!in_array(url, urlArr) && app.globalData.needCheck) {
    isRequesting = false;

    arrRequest = [];
    return false;
  }

  //替换成token
  var token = wx.getStorageSync('token');
  if (token != "" && token != null) {
    var header = { 'content-type': 'application/json', 'Authorization': "Bearer " + token }
  } else {
    var header = { 'content-type': 'application/json' }
  }
  if(host==''){
    var config = require('../config');
    host = config.Server; //UAT
  }
  url = host + url;
  console.log('host:',host);
  wx.request({
    url: url,
    method: method,
    data: JSON.stringify(data),
    header: header,
    success: res => {
      console.log('res url:',url);
      console.log(res);
      if (res.statusCode <= 300) {
        success(res.data);
      } else if (res.statusCode == 400) {
        console.log('res.statusCode:', res.statusCode)
        clearRequestArr();
        wx.showModal({
          title: '请求失败',
          content: res.data.error,
          showCancel: false,
          success: function (response) {
            console.log('400:', response);
            if (response.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
        // fail(res.data.error)
      } else if (res.statusCode == 401) {
        console.log('res.statusCode:', res.statusCode)
        wx.removeStorageSync('token');
        var loginApi = require('login');
        wx.hideLoading();
        isRequesting = false;
        arrRequest.unshift(currObj);
        var aa = getApp();
        loginApi.login(getApp());
        return;
      } else if (res.statusCode == 403) {
        console.log('res.statusCode:', res.statusCode)
        clearRequestArr();
        wx.showModal({
          title: '无权限',
          content: res.data.error,
          showCancel: false,
          success: function (response) {
            console.log('403:', response);
            if (response.confirm) {
              wx.navigateTo({
                url: '../auth/auth',
              })
            }
          }
        })
      } else if (res.statusCode == 404) {
        console.log('res.statusCode:', res.statusCode)
        clearRequestArr();
        wx.showModal({
          title: '请求失败',
          content: res.data.error,
          showCancel: false,
          success: function (response) {
            if (response.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
        // fail(res.statusText)
      } else {
        clearRequestArr();
        wx.showModal({
          title: '请求失败',
          content: res.statusText,
          showCancel: false,
          success: function (response) {
            if (response.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
      }
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
            if (currObj.showload) {
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
      console.log(res);
      if (res['statusCode'] === 200) {
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
