// pages/initiate/initiate.js
import regeneratorRuntime from '../../agilent/regenerator-runtime/runtime'
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    setTimeout(function () {
      _this.wxlogin();
      /*wx.redirectTo({
        url: '/pages/login/login'
      });*/
    }, 1000)


    //
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  wxlogin() {
    var that = this;

    app.globalData.syncFlag = true;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          util.NetRequest({
            url: 'wechat-mini/wx-login',
            data: {
              code: res.code,
              userMobile: JSON.stringify(app.userMobile)
            },
            showload: true,
            success: function (r) {
              app.globalData.isLoading = false;
              console.log(r);
              if (r.success == true) {
                app.globalData.needCheck = false;
                wx.setStorageSync('MOBILE', r.mobile);
                wx.setStorageSync('OPENID', r.openid);
                app.globalData.isLogin = true;
                //that.gotoIndex();

                app.globalData.syncFlag = false;

                util.NetRequest({
                  url: 'wechat-mini/get-global-group',
                  showload: false,
                  success: function (res1) {
                    app.globalData.sobotData = res1.data;

                    wx.switchTab({
                      url: '/pages/index/index',
                    });
                  }
                });

              }else {
                app.globalData.needCheck = true;
                app.globalData.isFollow = false;
                wx.navigateTo({
                  url: '/pages/login/login'
                });
              }
            },
            fail:function(){
              that.wxlogin();
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
})
