// pages/invoiceDetails/invoiceDetails.js
var util = require('../../utils/util.js');
var isSend = false;
var config = require('../../config.js');
var invoiceInfo = {};
var sendInfo = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendWhom: [
      { name: 'me', value: '我自己',checked: 'true' },
      { name: 'other', value: '其他人' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var userInfo = wx.getStorageSync('userInfo');
    sendInfo.sendName = userInfo.name;
    sendInfo.sendMobile = userInfo.mobile;
  },
  bindInvoiceInput: function (e) {
    console.log(e.currentTarget.dataset.type);
    var inputType = e.currentTarget.dataset.type;
    invoiceInfo[inputType] = e.detail.value;
    this.setData({
      invoiceInfo: invoiceInfo
    })
  },
  bindSendInput: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.type);
    var inputType = e.currentTarget.dataset.type;
    sendInfo[inputType] = e.detail.value;
    this.setData({
      sendInfo: sendInfo
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
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