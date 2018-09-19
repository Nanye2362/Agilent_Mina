// pages/repair/repair.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    imgUrl: config.Server + 'images/Send_banner.jpg',
    // imgUrls: [
    //   {
    //     url: config.Server + 'images/Send_1.jpg',
    //   }, 
    //   {
    //     url: config.Server + 'images/Send_2.jpg',
    //   },
    //   {
    //     url: config.Server + 'images/Send_3.jpg',
    //   }, 
    //   {
    //     url: config.Server + 'images/Send_4.jpg',
    //   },
    //   {
    //     url: config.Server + 'images/Send_5.jpg',
    //   }
    // ],
    imgUrls: [
      {
        url: config.Server + 'images/Send_1.jpg',
      },
      {
        url: config.Server + 'images/Send_2.jpg',
      },
      {
        url: config.Server + 'images/Send_3.jpg',
      },
      {
        url: config.Server + 'images/Send_4.jpg',
      },
      {
        url: config.Server + 'images/Send_5.jpg',
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 获取系统信息 */
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
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

  }
})