//app.js
var util = require('/utils/util.js');
//var aldstat = require("./utils/ald-stat.js");
var mta = require('/utils/mta_analysis.js');
App({
  onLaunch: function () {
        mta.App.init({
          "appID": "500539156",
          "eventID": "500539161",
        });
        this.mta = mta;
    
    this.globalData.isLoading = true;
    this.wxlogin();
  },
  onShow: function (res) {
    console.log(res);
    var that = this;
    if (!that.globalData.isSetOption && !that.globalData.isFirstLunch) {
      that.wxlogin();
    }
    that.globalData.isFirstLunch = false;
  },
  globalData: {
    userInfo: null,
    requestList: [],
    isLoading: false,
    isLogin: false,
    isWelcomeAuth: false,
    needCheck: false,
    isSetOption: false,
    isFirstLunch: true,
    isUploading: false
    //token: wx.getStorageSync('token')
  },
  /*
  gotoIndex: function () {
    console.log('enter');
    if (this.globalData.isWelcomeAuth && this.globalData.isLogin) {
      this.globalData.isLoading = false;
      wx.switchTab({
        url: '../index/index',
      })
    }
  },*/
  wxlogin: function () {
    var that = this;
    var app = getApp();
    wx.showLoading({
      title: '加载中，请稍后',
      mask: true
    })
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          util.NetRequest({
            url: 'wechat-mini/wx-login',
            data: {
              code: res.code
            },
            showload: false,
            success: function (r) {
              console.log(r);
              if (r.success == true) {
                console.log(that);
                that.globalData.needCheck = false;
                wx.setStorageSync('MOBILE', r.mobile);
                wx.setStorageSync('OPENID', r.openid);
                that.globalData.isLogin = true;
                //that.gotoIndex();
              } else {
                that.globalData.needCheck = true;
                wx.showModal({
                  title: '温馨提示',
                  content: '为了更好的体验，请关注“安捷伦售后服务”公众号后再使用小程序。',
                  showCancel: false,
                  success: function (res) {
                    that.wxlogin();
                  }
                })
                console.log(r.error_msg);
              }
            },
            complete: function () {
              that.globalData.isLoading = false;
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
  /*
  showTips: function () {
    var displayTips = this.data.displayTips
    console.log('showtips')
    this.setData({
      displayTips: !displayTips
    })
  },*/
})