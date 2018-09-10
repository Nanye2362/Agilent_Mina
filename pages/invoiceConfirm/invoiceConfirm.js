// pages/invoiceConfirm/invoiceConfirm.js
var util = require('../../utils/util.js');
var isSend = false;
var config = require('../../config.js');
var invoiceArry = {
  "normalInvoice": {
    'title': "发票抬头",
    'taxNumber': "纳税人识别号",
  },
  "specialInvoice": {
    "title": "发票抬头",
    "taxNumber": "纳税人识别号",
    "bankName": "开户行",
    "bankAccount": "银行账号",
    "companyAddress": "注册地址",
    "telephone": "注册电话",
  }
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendWhom: [
      { name: 'me', value: '我自己', checked: 'true' },
      { name: 'other', value: '其他人' }
    ],
    sendObj: {
      "name": "寄送人姓名",
      "telephone": "联系电话",
      "address": "地址",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.url=='invoiceConfirm'){
      this.setData({
        isConfirm: 0,
      })  
    }else{
      this.setData({
        isConfirm: options.isConfirm,
      })
    }
    var invoiceDetails = wx.getStorageSync('invoiceDetails');
    this.setData({
      invoiceInfo: invoiceDetails.invoiceInfo,
      sendInfo: invoiceDetails.sendInfo,
      PO: invoiceDetails.PO,
      needBill: invoiceDetails.needBill,
      invoiceType: invoiceDetails.invoiceType,
      invoice: invoiceArry[invoiceDetails.invoiceType],
    })    
  },

  submit: function(){
    // wx.navigateTo({
    //   url: '../budget_confirm/budget_confirm'
    // })
    console.log(getCurrentPages());
    var pages = getCurrentPages();
    var nums;
    for (var i in pages) {
      if (pages[i].route == 'pages/budget_confirm/budget_confirm') {
        nums = i + 1;
      }
    }
    wx.navigateBack({
      delta: pages.length - nums
    })
  },
  goBackEdit: function(){
    wx.navigateTo({
      url: '../invoiceDetails/invoiceDetails?invoiceType='+this.data.invoiceType,
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