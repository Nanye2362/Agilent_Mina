// pages/confirm_info/confirm_info.js
var common = require("../../utils/common.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProductId: '',
    ProductDesc: '',
    SerialNo: '',
    CpName: '',
    ShipToName: '',
    userInfo: {},
    TECH: '',
    NONTECH: ''
  },
  clickToNext: function(){
    wx.redirectTo({
      url: '../serial_number/serial_number',
    })
  }, 
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      ProductId: options.ProductId,
      ProductDesc: options.ProductDesc,
      SerialNo: options.SerialNo,
      CpName: options.CpName,
      ShipToName: options.ShipToName,
      TECH: 'T_psn:' + options.SerialNo,
      NONTECH: 'N_psn:' + options.SerialNo,
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



})