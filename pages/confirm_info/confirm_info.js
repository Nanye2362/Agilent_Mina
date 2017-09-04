// pages/confirm_info/confirm_info.js
var common = require("../../utils/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: { 'ID': 'G4514A', 'desc': '7693A Tray,150Vial', 'seriNo': 'CN15020073', 'name': '张三丰', 'company': '高知特信息技术(上海)有限公司 高知特信息技术(上海)有限公司', 'grade':'金牌客户' }
  },
  clickToNext: function(event){
    common.clickToNext(event);
  } ,
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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