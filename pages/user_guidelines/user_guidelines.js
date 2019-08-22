// pages/template/template.js
var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();

    var url="";
    if (config.En=="DEV"){
      url ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbed9f0dd30870bab&redirect_uri=https%3a%2f%2fqa.wechat.service.agilent.com%2fsite%2fuser-guidelines&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
    }else{
      url ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf939d5b301703b2f&redirect_uri=https%3a%2f%2fprd.wechat.service.agilent.com%2fsite%2fuser-guidelines&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
    }

    this.setData({
      url:url
    });
    //腾讯mat统计结束
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
      var app=getApp();
      app.wxlogin();
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
