// pages/transport_info/transport_info.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tracking_id:'',
    trackingInfoList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tracking_id = options.tracking_id;
    var sn = options.sn;
    this.setData({
      tracking_id: tracking_id,
      sn: options.sn
    })
    var that = this;
    console.log(options);
    // GET api/v1/sr/get-tracking?tracking_id=
    util.NetRequest({
      url: 'api/v1/sr/get-tracking?tracking_id='+tracking_id,
      method: "GET",
      success: function (r) {
        console.log('物流信息：',r);
        var trackingData=r.data.routes;
        for(let i in trackingData){
          trackingData[i].date=trackingData[i].acceptTime.substring(5,10);
          trackingData[i].time=trackingData[i].acceptTime.substring(11,19);
        }
        trackingData.reverse();
        console.log('trackingData:',trackingData);
        that.setData({
          trackingInfoList:trackingData
        })
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