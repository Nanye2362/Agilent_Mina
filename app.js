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
            showload:false,
            success: function (r) {
              console.log(r);
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
                      userInfo: JSON.stringify(res.userInfo)
                    },
                    success: function (m) {
                      console.log(m);
                      if (m.success == true) {
                        app.globalData.needCheck = false;
                        wx.setStorageSync('MOBILE', m.mobile);
                        wx.setStorageSync('OPENID', m.openid);
                        app.globalData.isLogin=true;
                        app.gotoIndex();
                      } else {
                        wx.hideLoading();
                        app.globalData.needCheck=true;
                        wx.showModal({
                          title: '温馨提示',
                          content: '请先关注安捷伦公众账号',
                          showCancel: false,
                          success: function (res) {
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
  },
  onShow: function (res) {
    var that=this;
    if (that.globalData.needCheck){
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
                that.globalData.needCheck = false;
                wx.setStorageSync('MOBILE', m.mobile);
                wx.setStorageSync('OPENID', m.openid);
                that.globalData.isLogin = true;
                that.gotoIndex();
              } else {
                that.globalData.needCheck=true;
                wx.hideLoading();
                wx.showModal({
                  title: '温馨提示',
                  content: '请先关注安捷伦公众账号',
                  showCancel: false,
                  success: function (res) {
                  }
                })
                console.log(m.error_msg);
              }
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    requestList: [],
    isLoading: false,
    isLogin:false,
    isWelcomeAuth:false,
    needCheck:false
    //token: wx.getStorageSync('token')
  },
  gotoIndex: function () {
    console.log('enter');
    if (this.globalData.isWelcomeAuth && this.globalData.isLogin){ 
      this.globalData.isLoading=false;
      wx.switchTab({
        url: '../index/index',
      })
    }
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