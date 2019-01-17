// pages/service_result/service_result.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
   
    resultList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束
    var value = options.value;
    var that = this;
    console.log(value)
    util.NetRequest({
      url: 'sr/history-filter',
      data: {
        'keywords': value
      },
      success: function (res) {
        console.log(res);
        var resultList = res.HistoryFilter;

        that.setData({
         
          resultList: resultList,
        
        })
      }
    });
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
  // 点击跳转历史详情 data:{SrId:} site-mini/service-details
  clickToDetail: function (e) {
    console.log(e);
    var SrId = e.currentTarget.dataset.srid;
    // var SrDesc = e.currentTarget.dataset.srdesc;
    // var Surveyid = e.currentTarget.dataset.surveyid;
    console.log(SrId);
    wx.navigateTo({
      url: '../service_details/service_details?SrId=' + SrId
    })
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