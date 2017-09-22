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
            success: function (r) {
              console.log(r);
              wx.setStorageSync('session3rd', r.session3rd);
              wx.getUserInfo({
                success: function (res) {
                  console.log(res);
                  console.log(wx.getStorageSync('session3rd'));
                  util.NetRequest({
                    url: 'wechat-mini/get-userinfo',
                    data: {
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      session3rd: wx.getStorageSync('session3rd'),
                      userInfo: JSON.stringify(res.userInfo)
                    },
                    success: function (m) {
                      console.log(m);
                      if (m.success == true) {
                        wx.setStorageSync('MOBILE', m.mobile);
                        wx.setStorageSync('OPENID', m.openid);
                      } else {
                        wx.showModal({
                          title: '温馨提示',
                          content: '请先关注安捷伦公众账号',
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {

                            }
                          }
                        })
                        console.log(m.error_msg);
                      }
                    },
                    complete: function () {
                      app.globalData.isLoading = false;
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
    requestList: [],
    isLoading: false
    //token: wx.getStorageSync('token')

  },
  /*
  showTips: function () {
    var displayTips = this.data.displayTips
    console.log('showtips')
    this.setData({
      displayTips: !displayTips
    })
  },*/
})