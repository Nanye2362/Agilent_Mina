// pages/confirm_info/confirm_info.js
var common = require("../../utils/common.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProductId:'',
    ProductDesc:'',
    SerialNo: '',
    CpName: '',
    ShipToName: '',
    userInfo: {},
    //userInfoJson: '',
  },
  clickToNext: function(event){
    common.clickToNext(event);
  } ,
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var meiqia = wx.getStorageSync('meiqia')
    this.setData({
      TECH: meiqia.TECH,
      NONTECH: meiqia.NONTECH
    })
    this.setData({
      ProductId: options.ProductId,
      ProductDesc: options.ProductDesc,
      SerialNo: options.SerialNo,
      CpName: options.CpName,
      ShipToName: options.ShipToName
    })    
    this.setData({
      userInfoJson: '123'
    })
    /*
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        console.log(userInfo)
        console.log(JSON.stringify(userInfo))
      }
    })*/
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