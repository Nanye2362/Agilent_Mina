// pages/faq_details/faq_details.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usefulFlag: false,
    unusefulFlag: false,
    maskFlag: true,
    TECH:'',
    answers:'',
    questions:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var that = this;
    var meiqiaInfo = wx.getStorageSync('meiqia');

    util.NetRequest({
      url: 'site-mini/faq-details',
      data: {
        'id': options.id
      },
      success: function (res) {
        console.log(res);

        that.setData({
          TECH: meiqiaInfo.TECH,
          answers: res.detail.answers,
          questions: res.detail.questions
        })
      }
    });
  
  },

  usefulClick: function(e){
    console.log(e)
    this.setData({ usefulFlag: true, maskFlag: false });

  },

  unusefulClick:function(){
    this.setData({ unusefulFlag: true, maskFlag: false });
  },

  clickToRepair: function () {
    util.checkWorktime(function () {
      //是工作时间跳转serial number页面
      wx.navigateTo({
        url: '../serial_number/serial_number',
      })
    }, function () {
      //是工作时间跳转leave-message页面
      wx.navigateTo({
        url: '../leave_message/leave_message',
      })
    })
  },
  //拨打电话
  calling: function (event) {
    var phone = event.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

})