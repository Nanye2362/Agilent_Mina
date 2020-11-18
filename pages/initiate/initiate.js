// pages/initiate/initiate.js
import regeneratorRuntime from '../../agilent/regenerator-runtime/runtime'
var util = require('../../utils/util.js');
var loginApi = require('../../utils/login.js');
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
    // var _this = this;
    // setTimeout(function () {
    //   _this.wxlogin();
    //   /*wx.redirectTo({
    //     url: '/pages/login/login'
    //   });*/
    // }, 1000)


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
    var token = wx.getStorageSync('token');
    console.log('initiate token',token);
    if (token != '') {
      console.log('initiate有token:',token)
      if (getApp().globalData.needCheck == true) {
        loginApi.login({ showLoad: false })
      } else {
        setTimeout(
          function () {
            wx.switchTab({
              url: '../index/index',
            })
            console.log('welcome页面正在跳转');
          }, 3000);
      }
    }else{
      console.log('initiate没有token');
      loginApi.login({ showLoad: false })
    }
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

})
