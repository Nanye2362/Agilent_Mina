// pages/invoice_confirm_info/invoice_confirm_info.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalTip:false,
    tipText:'',
    objectid: '',
    invoiceInfo: {
      "type": 0,
      "title": '',
      "taxpayer_recognition_number": '',
      "bank": '',
      "bank_account": '',
      "registered_address":'',
      "registered_phone": '',
      "recipient": '',
      "mail": '',
      "tel": '',
      "address": '',
      "po_code": '',
      "sales_list": ''
    },
    sendInfo: {
      "name": "",
      "telephone": "",
      "address": "",
    },
    currentInvoice:'',
    invoiceDetails:{},
    isConfirm:0,
    pageComplete:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options);
    if (typeof (options.objectId) != 'undefined') {
      this.setData({
        objectid: options.objectId
      })
    }
    //腾讯mat统计开始
    var app = getApp();
    var that = this;
    util.NetRequest({
      url: 'api/v1/wechat/get-global-group',//wechat-mini/get-global-group
      method: "GET",
      success: function (res) {
        app.globalData.sobotData = res.data;
        util.getUserInfoSobot();
        that.setData({
          transferAction: util.sobotTransfer(4),
        });
      }
    });
    app.mta.Page.init();
    //腾讯mat统计结束
     util.NetRequest({
      url: 'api/v1/sr/bq?objectid=' + this.data.objectid,
      method: 'GET',
      success: function (r) {
        console.log(r);
        if (r.data.status != false) {
          console.log('r.data.invoice:', r.data.invoice);
          if (r.data.invoice.length > 0) {
           that.setData({
            invoiceInfo:r.data.invoice[0],
            isConfirm: r.data.is_confirmed,
            pageComplete:true
           })
          }      
        } else if (r.data.status == false) {
          that.setData({
            isConfirm: r.data.is_confirmed,
            pageComplete:true
          })
        }
      }
    })
  },
  
  //检测工作时间
  MtaReport: function () {
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'NONTECH' });
  },
  toSelectInvoice() {
    if(typeof(this.data.invoiceInfo.id)!='undefined'){
      wx.navigateTo({
        url: '../invoice_list/invoice_list?invoiceId='+this.data.invoiceInfo.id,
      })
    }else{
      wx.navigateTo({
        url: '../invoice_list/invoice_list'
      })
    }
    
  },
  submit() {
    var that =this;
    // api/v1/sr/fill-invoice POST objectid invoice{}
    if(typeof(that.data.invoiceInfo.id)=='undefined'){
      wx.showModal({
        title: '提交失败',
        content: '请选择发票',
      })
      return false;
    }else if (typeof(that.data.invoiceInfo.id)!='undefined') {
      var params = {
        objectid: that.data.objectid,
        invoice: that.data.invoiceInfo
      };
      util.NetRequest({
        url: 'api/v1/sr/fill-invoice',
        method: "POST",
        data: params,
        success: function (r) {
          console.log('提交发票信息：',r);
          that.setData({
            showModalTip: true,
            tipText: '感谢您选择安捷伦送修，稍后您的专属调度将为您安排后续服务'
          })
        }
      })
    }   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
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