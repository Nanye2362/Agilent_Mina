// pages/serviceOrder/serviceOrder.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.Server + 'images/serviceOrder.jpg',
    serviceList: [
      { 
        'icon': "/images/installPic.png",
        'title' : '安装申请',
        'describe':'申请工程师上门安装各类实验仪器',
        'arrow':'/images/arrow_grey.png',
        'url': '../install/install'
      },
      {
        'icon': "/images/PMPic.png",
        'title': '预防性维护（PM）',
        'describe': '申请各类仪器预防性维护及保养',
        'arrow': '/images/arrow_grey.png',
        'url': '../PM/PM'
      },
      {
        'icon': "/images/OQPic.png",
        'title': '法规认证（OQ）',
        'describe': '申请各类仪器的法规认证',
        'arrow': '/images/arrow_grey.png',
        'url': '../OQ/OQ'
      },   
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  gotoNext: function(e){
    var url = e.currentTarget.dataset.url;
    console.log(url);
    wx.navigateTo({
      url: url
    })
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