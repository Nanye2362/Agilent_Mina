// pages/faq_details/faq_details.js
var util = require('../../utils/util.js');
var config = require("../../config.js");


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
    console.log('id='+options.id)
    var that = this;
    var meiqiaInfo = wx.getStorageSync('meiqia');

    util.NetRequest({
      //url: 'admin/v1/guide/article/'+options.id,
      url: 'wechat/h5/faq/details/1',
      method:'GET',
      success: function (res) {
        var app = getApp();
        app.mta.Event.stat("self_service_question", { "title": res.data.article_title });
        console.log(res);
        if (res.data.type==1){
          that.setData({
            type:2,
            url: res.data.article_title
          })
          return;
        } else if (res.data.type == 2){
          that.setData({
            type: 2,
            //url: config.Server + 'admin/v1/guide/article/'+options.id,
            url: config.Server + 'wechat/h5/faq/details/1',
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
          answersList: res.data,
          questions: res.data.article_title,
        })   
      },
      complete: function () {
        wx.hideLoading();
      },
    });
    // that.setData({
    //     type:2,
    //     url: 'https://qa.wechat.service.agilent.com/wechat/h5/faq/details/'+options.id
    // })
  
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