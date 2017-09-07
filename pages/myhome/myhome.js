// pages/myhome/myhome.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  clickToNext: function (event) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          console.log('点击确认')

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  SelfInfo: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  MyInstrument: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  ServiceGuide: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  Unbind: function () {
    console.log('unbind');
  },

  Auth: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求后台接口
    util.NetRequest({
      url: 'site-mini/my-count',
      data: {},
      success: function (res) {
        console.log(res); //后台获取到的mycount数据
        that.setData({
          ContactGuid: res.ContactGuid,
          InstrumentCount: res.InstrumentCount,
          company: res.company,
          email: res.email,
          head_img_url: res.head_img_url,
          is_auth: res.is_auth,
          mobile: res.mobile,
          name: res.name
        });
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