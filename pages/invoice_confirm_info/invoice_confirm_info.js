// pages/invoice_confirm_info/invoice_confirm_info.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromPage:'',
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
    invoiceDetails:{},
    isConfirm:0,
    hasInvoice:false,
    pageComplete: false,
    pageShow: false, //本人显示，非本人不显示
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
    if (typeof (options.fromPage) != 'undefined') {
      this.setData({
        fromPage: options.fromPage
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
            hasInvoice:true
           })
          } 
          if(r.data.is_confirmed==1){
            that.setData({
              isConfirm: r.data.fill_invoice?1:0,
              pageComplete:true,
              pageShow:true
            }) 
          }else{
            that.setData({
              isConfirm: 0,
              pageComplete:true,
              pageShow:true
            }) 
          } 
        } else if (r.data.status == false) {
          that.setData({
            isConfirm: r.data.is_confirmed,
            pageComplete:true,
            pageShow:false
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
    if(typeof(that.data.invoiceInfo.id)=='undefined'&&that.data.hasInvoice==false){
      wx.showModal({
        title: '提交失败',
        content: '请选择发票',
      })
      return false;
    }else {
      var params = {
        objectid: that.data.objectid,
        invoice: that.data.invoiceInfo
      };
      if(that.data.fromPage=='budget_confirm_info'){
        console.log('来自budget_confirm_info:',params);
        util.NetRequest({
          url: 'api/v1/sr/bq',
          method: "POST",
          data:params,
          success(r) {
            console.log('提交发票信息：',r);
            that.data.isConfirm=1;
            that.setData({
              showModalTip: true,
              tipText: '感谢您选择安捷伦送修，稍后您的专属调度将为您安排后续服务'
            })
          }
        })
      }else{
        console.log('来自推送:',params);
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
    if(this.data.isConfirm==1){
      wx.switchTab({
        url: '../index/index',
      })
    }
   
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