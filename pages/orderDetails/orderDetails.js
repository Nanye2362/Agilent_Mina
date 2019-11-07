// pages/orderDetails/orderDetails.js
var util = require('../../utils/util.js');
var orderArry={
  "install":{
    "CreateTime":"预约日期",
    "OrderNo":"订单号",
    "InsType":"仪器类型",
    "UserName":"姓名",
    "Company":"公司名称",
    "MOBILE":"手机号",
    "ExpectedDate":"期望日期",
    "AdditionalInfo":"附加信息"
  },
  "pm":{
    "CreateTime":"预约日期",
    "SerialNo":"序列号",
    "UserName":"姓名",
    "Company":"公司名称",
    "MOBILE":"手机号",
    "ExpectedDate":"期望日期",
    "ConfigInfo":"配置信息"
  },
  "oq":{
    "CreateTime":"预约日期",
    "SerialNo":"序列号",
    "UserName":"姓名",
    "Company":"公司名称",
    "MOBILE":"手机号",
    "ExpectedDate":"期望日期"
  }
}



Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArry:orderArry,
    orderType:"",
    transferAction: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);

    this.setData({
      orderType: options.orderType,
      transferAction: util.sobotTransfer(5)
    })
    util.NetRequest({
      url: 'site-mini/appointment-details',
      data: {
        id: options.orderID,
        orderType: options.orderType,
      },
      success: function (res) {
        var details = res.AppointmentDetails;
        console.log(details);
        that.setData({
          orderDetails: details,
        })
      }
    });
  },
  goBack: function(){
    wx.navigateBack({
      delta: 1
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
