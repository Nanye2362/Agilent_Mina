//app.js
var util = require('/utils/util.js');
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
              console.log(r.session3rd);
              wx.setStorageSync('session3rd', r.session3rd);
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
                      userInfo: res.userInfo
                    },
                    success: function (m) {
                      console.log(m);
                      if (m.success == true) {
                        wx.setStorageSync('MOBILE', m.mobile);
                        wx.setStorageSync('OPENID', m.openid);
                      } else {
                        console.log(m.error_msg);
                      }
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
  onShow: function () {
    console.log(1111);
  },
  globalData: {
    userInfo: null,
    appid: 'wxdc8257b9f4a04386',
    secret: 'd140b3cd0ad5b4d07f87e081dafb3b8b',
    //token: wx.getStorageSync('token')

  }
})