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
    CpName: '',
    ShipToName: '',
    aglNum:'',
    userInfo: {},
    TECH:'',
    NONTECH:'',
    needChat:true,
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
    console.log(options);
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
   console.log(options);
   if(typeof(options.aglNum) != 'undefined' && options.aglNum.length>0){
       this.setData({
         aglNum: "&"+options.aglNum
       })
   }

    //腾讯mta统计结束
    this.setData({
      ProductId: options.ProductId,
      ProductDesc: options.ProductDesc,
      SerialNo: options.SerialNo,
      CpName: options.CpName,
      ShipToName: options.ShipToName,
      TECH: 'T_psn:' + options.SerialNo,
      RTECH: 'T_rsn:' + options.SerialNo,
      NONTECH: 'T_psn:' + options.SerialNo
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