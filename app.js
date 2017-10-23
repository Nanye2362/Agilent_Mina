//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        var that = this;
        var app = getApp();
        app.globalData.isLoading = true;
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
              wx.setStorageSync('session3rd', r.session3rd);
              
              app.getUserInformation();
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  onShow: function (res) {
    console.log(res);
    var app = getApp();
    if (!app.globalData.isSetOption){
      app.getUserInformation();
    }
  },

  globalData: {
    userInfo: null,
    requestList: [],
    isLoading: false,
    isLogin: false,
    isWelcomeAuth: false,
    needCheck: false,
    isSetOption:false
    //token: wx.getStorageSync('token')
  },
  gotoIndex: function () {
    console.log('enter');
    if (this.globalData.isWelcomeAuth && this.globalData.isLogin) {
      this.globalData.isLoading = false;
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  getUserInformation: function () {
    var app = getApp();
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        console.log(wx.getStorageSync('session3rd'));
        util.NetRequest({
          url: 'wechat-mini/get-userinfo',
          showload: false,
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv,
            session3rd: wx.getStorageSync('session3rd'),
            userInfo: JSON.stringify(res.userInfo)
          },
          success: function (m) {
            console.log(m);
            if (m.success == true) {
              app.globalData.needCheck = false;
              wx.setStorageSync('MOBILE', m.mobile);
              wx.setStorageSync('OPENID', m.openid);
              app.globalData.isLogin = true;
              app.gotoIndex();
            } else {
              wx.hideLoading();
              app.globalData.needCheck = true;
              wx.showModal({
                title: '温馨提示',
                content: '为了更好的体验，请关注“安捷伦售后服务”公众号后再使用小程序。',
                showCancel: false,
                success: function (res) {
                  
                }
              })
              console.log(m.error_msg);
            }
          }
        })
      },
      fail: function () {
        app.globalData.isSetOption = true;
        wx.showModal({
          title: '警告',
          content: '必须允许才可以继续使用小程序。重试可以微信-发现-小程序-左滑删除这个小程序-重新进入-允许开始使用小程序',
          showCancel: false,
          success: function (res) {
            // that.getUserInfo();
            wx.openSetting({
              success: (res) => {
                app.getUserInformation();
                app.globalData.isSetOption=false;
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
              }
            })
          }
        })
        console.log('拒绝getuserinfo');
        wx.hideLoading();
      }
    })
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