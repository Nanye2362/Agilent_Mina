//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function () {
    var check_session = wx.getStorageSync('PHPSESSID');
    if (check_session != '' && check_session != null) {
      wx.checkSession({
        success: function (res) {
          console.log(res);
          console.log("check session true");

          //session 未过期，并且在本生命周期一直有效
        },
        fail: function () {
          //登录态过期
          wx.login({
            success: function (res) {
              var that = this;
              var app = getApp();
              app.globalData.isLoading = true; console.log(res);
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
                            app.globalData.isLoading = false;
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
        }
      });
    } else {
      wx.login({
        success: function (res) {
          var that = this;
          var app = getApp();
          app.globalData.isLoading = true; console.log(res);
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
                        app.globalData.isLoading = false;
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
    }
  },
  onShow: function () {
	wx.setStorageSync('meiqia',{
      'WLA': "f78d058fe6b848ddf4d6d2f7560eb243",
      'TECH': "02c543de336fbe2b223a920acf3c7fef",
      'NONTECH': 'badbfa2338c8a960f55f6fc6e1f2279e',
    })
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