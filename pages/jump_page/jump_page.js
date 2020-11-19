// pages/jump_page/jump_page.js
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
    // this.wxlogin();
    console.log("wx.getStorageSync('AuthFromPage'):",wx.getStorageSync('AuthFromPage'));
    getApp().globalData.needCheck = false;
    getApp().globalData.isFollow = true;
    if( wx.getStorageSync('AuthFromPage')!= ''&& wx.getStorageSync('AuthFromPage')!= 'pages/initiate/initiate'&& wx.getStorageSync('AuthFromPage')!= 'pages/index/index'){
      wx.navigateTo({
        url:'/'+ wx.getStorageSync('AuthFromPage') ,
      })
      wx.removeStorageSync('AuthFromPage');
    }else{
      wx.removeStorageSync('AuthFromPage');
      wx.switchTab({
        url: '../index/index',
      });
    } 

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

})
