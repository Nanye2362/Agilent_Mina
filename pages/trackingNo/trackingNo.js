// pages/trackingNo/trackingNo.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliveryno: '',
    istracking: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var deliveryno = options.deliveryno;
    var sn = options.sn;
    this.setData({
      deliveryno: deliveryno,
      sn: options.sn
    })
    var that = this;
    console.log(options);
    wx.request({
      url: 'https://www.kuaidi100.com/query?type=shunfeng&postid=' + deliveryno,
      success(res) {
        console.log(res);
        if (res.data.status=='200') {
          that.setData({
            istracking: true,
            tracking: res.data.data,
          })
        }
      }
    })
  },
  //返回
  goBack: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  //查看送修服务
  gotoCheck: function(){
    wx.navigateTo({
      url: '../repair/repair?sn=' + this.data.sn,
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