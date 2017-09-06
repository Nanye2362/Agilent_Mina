//app.js
var util = require('/utils/util.js');
// var WebServer = 'https://devopsx.coffeelandcn.cn/';
var WebServer = 'https://msd.coffeelandcn.cn/agilent_web/web/';
App({
  onLaunch: function () {
    // wx.checkSession({
    //   success: function () {
    //     //session 未过期，并且在本生命周期一直有效
    //   },
    //   fail: function () {
    //     //登录态过期

    //   }
    // });
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: WebServer + 'wechat-mini/wx-login',
            data: {
              code: res.code
            },
            success: function (r) {
              console.log(r.data); //session3rd
              wx.setStorageSync('session3rd', r.data);
              console.log(wx.getStorageSync('session3rd'));
              wx.getUserInfo({
                success: function (res) {
                  console.log(res);
                  var userInfo = res.userInfo
                  wx.request({
                    url: WebServer + '/wechat-mini/get-userinfo',
                    data: {
                      session3rd: wx.getStorageSync('session3rd'),
                      userInfo: userInfo
                    },
                    success: function () {

                    }
                  })
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    appid: 'wxdc8257b9f4a04386',
    secret: 'd140b3cd0ad5b4d07f87e081dafb3b8b',
    //token: wx.getStorageSync('token')

  }
})