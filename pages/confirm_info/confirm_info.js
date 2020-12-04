// pages/confirm_info/confirm_info.js
var common = require("../../utils/common.js");
var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProductId:'',
    ProductDesc:'',
    SerialNo: '',
    name: '',
    company: '',
    aglNum:'',
    sourse:'&sourse:repair',
    userInfo: {},
    TECH:'',
    NONTECH:'',
    needChat:true,
    transferAction: ''
  },
  clickToNext: function(){
    wx.redirectTo({
      url: '../serial_number/serial_number',
    })
  },

  MtaReport: function () {

    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'TECH' });
  },
  MtaReportt: function () {

    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'NONTECH' });
  },
  skipReturn:function(){
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    console.log(options.needChat);
    this.setData({
      CanRepair: options.CanRepair
    })
   if (typeof (options.needChat)=='undefined'){
      var pages = getCurrentPages();
      for (var i in pages) {
        if (pages[i].route == "pages/my_instrument/my_instrument") {
          this.setData({
            needChat: false
          })
        }
      }
   }

   if(typeof(options.aglNum) != 'undefined' && options.aglNum.length>0){
       this.setData({
         aglNum: "&"+options.aglNum
       })
   }

   var that = this;
    that.setData({
      transferAction: util.RtransferAction(JSON.parse(options.group))
    });

    util.NetRequest({
      url: 'api/v1/instrument/'+options.id,
      method:"GET",
      success:function (res) {
        //腾讯mta统计结束
        that.setData({
          ProductId: res.data.product_id,
          ProductDesc: res.data.product_desc,
          SerialNo: res.data.SN,
          name: res.data.name,
          company: res.data.company,
          TECH: 'T_psn:' + res.data.SN,
          RTECH: 'T_rsn:' + res.data.SN,
          NONTECH: 'T_psn:' + res.data.SN
        })
      }
    })

  },

  backHome: function () {
    util.backHome()
  },
  gotoDetails: function(){
    wx.navigateTo({
      url: '../repair/repair?sn=' + this.data.SerialNo,
    })
  },
})
