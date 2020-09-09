// pages/orderDetails/orderDetails.js
var util = require('../../utils/util.js');
var orderArry=[{
    "created_at":"预约日期",
    "order_no":"订单号",
    "InsType":"仪器类型",
    "name":"姓名",
    "company":"公司名称",
    "mobile":"手机号",
    "expected_date":"期望日期",
    "additional_information":"附加信息"
  },{
    "created_at":"预约日期",
    "serial_no":"序列号",
    "name":"姓名",
    "company":"公司名称",
    "mobile":"手机号",
    "expected_date":"期望日期",
    "configration_information":"配置信息"
  },{
    "created_at":"预约日期",
    "serial_no":"序列号",
    "name":"姓名",
    "company":"公司名称",
    "mobile":"手机号",
    "expected_date":"期望日期"
  }
]



Page({

  /**
   * 页面的初始数据
   */
  data: {
    WLA:'W',
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
//orderType 0:安装申请 1：PM 2：OQ
    this.setData({
      orderType: options.orderType,
      transferAction: util.sobotTransfer(5)
    })
    util.NetRequest({
      url: 'api/v1/reservation/'+options.orderID,
      // data: {
      //   id: options.orderID,
      //   orderType: options.orderType,
      // },
      method:'GET',
      success: function (res) {
        // var details = res.AppointmentDetails;
        console.log(res);
        that.setData({
          orderDetails: res.data,
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
