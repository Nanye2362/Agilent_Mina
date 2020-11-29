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
      "title": "",
      "taxNumber": "",
      "companyAddress": "",
      "telephone": "",
      "bankName": "",
      "bankAccount": ""
    },
    sendInfo: {
      "name": "",
      "telephone": "",
      "address": "",
    },
    currentInvoice:'',
    invoiceDetails:{},
    isConfirm:0
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
        var currentInvoice = '';
        if (r.data.status != false) {
          if (r.data.invoice.length > 0) {
            currentInvoice = r.data.invoice[0].type == 0 ? 'normalInvoice' : 'specialInvoice';
          } else {
            that.setData({
              hasInvoice: false,
            })
          }
          console.log('r.data.invoice:', r.data.invoice);
          console.log('currentInvoice:', currentInvoice);

          if (r.data.invoice.length != '') {
            //for (var i in r.data.InvoiceInfo){
            that.setInvoiceInfo(r.data.invoice[0])
            //}  
            invoiceDetails = that.data.invoiceDetails
            console.log('invoiceDetails:', invoiceDetails);
            that.setData({
              invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
              sendInfo: invoiceDetails[currentInvoice].sendInfo,
              needBill: invoiceDetails[currentInvoice].needBill,
              PO: invoiceDetails[currentInvoice].PO,
              currentInvoice: currentInvoice,
            })         
          }
          else {
            wx.setStorageSync('invoiceDetails', {});
          }
        } else if (r.data.status == false) {
          that.setData({
            pageComplete: true,
            pageShow: false,
            bqId: options.objectId,
            isConfirm: r.data.is_confirmed
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
    wx.navigateTo({
      url: '../invoice_list/invoice_list?objectId='+this.data.objectid,
    })
  },
  submit() {
    var that =this;
    // api/v1/sr/fill-invoice POST objectid invoice{}
    if(that.data.currentInvoice == ''||Object.keys(invoiceDetails).length == 0){
      wx.showModal({
        title: '提交失败',
        content: '请选择发票',
      })
      return false;
    }else if (that.data.currentInvoice != ''&&Object.keys(invoiceDetails).length != 0) {
      var invoicedetails = invoiceDetails;
      var currentInvoice = this.data.currentInvoice;
      console.log('currentInvoice:', currentInvoice);
      invoicedetails[currentInvoice].needBill = invoiceDetails.needBill == true ? 1 : 0;
      invoicedetails[currentInvoice].invoiceType = invoiceDetails[currentInvoice].invoiceType == 'specialInvoice' ? 1 : 0;
      var params = {
        objectid: that.data.objectid,
        invoice: {
          "type": invoicedetails[currentInvoice].invoiceType,
          "title": invoicedetails[currentInvoice].invoiceInfo.title,
          "taxpayer_recognition_number": invoicedetails[currentInvoice].invoiceInfo.taxNumber,
          "bank": invoicedetails[currentInvoice].invoiceInfo.bankName,
          "bank_account": invoicedetails[currentInvoice].invoiceInfo.bankAccount,
          "registered_address": invoicedetails[currentInvoice].invoiceInfo.companyAddress,
          "registered_phone": invoicedetails[currentInvoice].invoiceInfo.telephone,
          "recipient": invoicedetails[currentInvoice].sendInfo.name,
          "mail": invoicedetails[currentInvoice].sendInfo.mail,
          "tel": invoicedetails[currentInvoice].sendInfo.telephone,
          "address": invoicedetails[currentInvoice].sendInfo.address,
          "po_code": invoicedetails[currentInvoice].PO,
          "sales_list": invoicedetails[currentInvoice].needBill
        }
      };
      util.NetRequest({
        url: 'api/v1/sr/fill-invoice',
        method: "POST",
        data: params,
        success: function (r) {
          console.log('提交发票信息：',r);
          this.setData({
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
    if (this.data.currentInvoice != '' && wx.getStorageSync('invoiceDetails') != '') {
      this.getInvoiceInfoStorage(this);
    }
  },
  // 存储发票信息
  setInvoiceInfo: function (info) {
    var that = this;
    var invoiceDetails = {},
      invoiceInfo = that.data.invoiceInfo,
      sendInfo = that.data.sendInfo;
    invoiceInfo.title = info.title;
    invoiceInfo.companyAddress = info.registered_address;
    invoiceInfo.taxNumber = info.taxpayer_recognition_number;
    invoiceInfo.bankName = info.bank;
    invoiceInfo.bankAccount = info.bank_account;
    invoiceInfo.telephone = info.registered_phone;
    sendInfo.name = info.recipient;
    sendInfo.address = info.address;
    sendInfo.telephone = info.tel;
    sendInfo.mail = info.mail;
    var needBill = info.sales_list == 0 ? 'false' : true;
    var invoiceType = info.type == 0 ? 'normalInvoice' : 'specialInvoice';
    invoiceDetails[invoiceType] = {}
    invoiceDetails[invoiceType].invoiceInfo = invoiceInfo;
    invoiceDetails[invoiceType].sendInfo = sendInfo;
    invoiceDetails[invoiceType].PO = info.po_code;
    invoiceDetails[invoiceType].needBill = needBill;
    invoiceDetails[invoiceType].invoiceType = invoiceType;
    wx.setStorageSync('invoiceDetails', invoiceDetails);
    that.data.invoiceDetails=invoiceDetails;
  },
  // 获取
  getInvoiceInfoStorage: function (that) {
    var currentInvoice = that.data.currentInvoice;
    invoiceDetails = wx.getStorageSync('invoiceDetails');
    console.log(invoiceDetails[currentInvoice]);
    that.setData({
      invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
      sendInfo: invoiceDetails[currentInvoice].sendInfo
    })
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