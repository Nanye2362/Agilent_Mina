// pages/faq_details/faq_details.js
var util = require('../../../utils/util.js');
var config = require("../../../config.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    usefulFlag: false,
    unusefulFlag: false,
    maskFlag: true,
    TECH:'',
    answersList:'',
    questions:'',
    type:0,
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mta统计结束
    var that = this;

    util.NetRequest({
      url: 'site-mini/self-service-detail?id='+options.id,
      data: {

      },
      success: function (res) {
        var app = getApp();
        app.mta.Event.stat("self_service_question", { "title": res.detail.questions });
        console.log(res);
        if (res.detail.type==1){
          that.setData({
            type:2,
            url: res.detail.answers[0].content
          })
          return;
        }else{
          that.setData({
            type: 1
          })
        }

        wx.showLoading({
          title: '下载中，请稍候',
          mask: true
        })
        that.setData({
          answersList: res.detail.answers,
          questions: res.detail.questions,
        })
      },
      complete: function () {
        wx.hideLoading();
      },
    });

  },

  usefulClick: function(e){
    console.log(e)
    this.setData({ usefulFlag: true, maskFlag: false });

  },
  backHome: function () {
    util.backHome()
  },

  unusefulClick:function(){
    this.setData({ unusefulFlag: true, maskFlag: false });
  },

  clickToRepair: function (e) {
    console.log(e.detail.iswork);
    if (e.detail.iswork){
      //是工作时间跳转serial number页面
      wx.navigateTo({
        url: '../serial_number/serial_number',
      })
    }else{
      //是工作时间跳转leave-message页面
      wx.navigateTo({
        url: '../leave_message/leave_message',
      })
    }
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
