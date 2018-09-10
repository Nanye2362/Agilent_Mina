var util = require('../../utils/util.js');
var invoiceDetails = wx.getStorageSync('invoiceDetails');

// pages/budget_confirm/budget_confirm.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bqId: "",
    info: "加载中",
    checkBox: false,
    pageComplete: false,
    shInputInfo: false,
    //0:normalInvoice,1:specialInvoice
    invoicetype: [
      { name: '0', value: '增值税普通发票' },
      { name: '1', value: '增值税专业发票' },
    ],
    invoiceInfo: {
      "errMsg": "",
      "type": 0,
      "title": "",
      "taxNumber": "",
      "companyAddress": "",
      "telephone": "",
      "bankName": "",
      "bankAccount": ""
    },
    sendInfo:{
      "name": "",
      "telephone": "",
      "address": "",
    },
    PO: '',
    needBill : '',
    invoiceType : '', 
  },
  clearStorage: function(){
    wx.removeStorageSync('invoiceDetails');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mat统计开始
    var app = getApp();
    var that = this;
    app.mta.Page.init();
    //腾讯mat统计结束
    console.log(options);
    util.NetRequest({
      url: 'site-mini/get-budget',
      data: {
        srId: options.srId,
        objectId: options.objectId
      },
      success: function (r) {
        console.log(r);
        var invoiceDetails = {},
        invoiceinfo = r.data.InvoiceInfo,
        invoiceInfo = that.data.invoiceInfo,
        sendInfo = that.data.sendInfo,
        PO = that.data.PO,
        invoiceType = that.data.invoiceType,
        needBill = that.data.needBill;
        console.log(invoiceinfo);
        if (invoiceinfo.InvoiceTitle == null) {
          if (wx.getStorageSync('invoiceDetails')!='') {
            that.getInvoiceInfoStorage(that);
          }
        } else {         
          invoiceInfo.title = invoiceinfo.InvoiceTitle;
          invoiceInfo.companyAddress = invoiceinfo.RegisteredAddress;
          invoiceInfo.taxNumber = invoiceinfo.TaxpayerRecognitionNumber;
          invoiceInfo.bankName = invoiceinfo.Bank;
          invoiceInfo.bankAccount = invoiceinfo.BankAccount;
          invoiceInfo.telephone = invoiceinfo.RegisteredPhone;
          sendInfo.name = invoiceinfo.Recipient;
          sendInfo.address = invoiceinfo.Address;
          sendInfo.telephone = invoiceinfo.Tel;
          PO = invoiceinfo.POCode;
          needBill = invoiceinfo.AccountSales == 0 ? 'false' : true,
          invoiceType = invoiceinfo.InvoiceType == 0 ? 'normalInvoice' : 'specialInvoice';
          invoiceDetails.invoiceInfo = invoiceInfo;
          invoiceDetails.sendInfo = sendInfo;
          invoiceDetails.PO = PO;
          invoiceDetails.needBill = needBill;
          invoiceDetails.invoiceType = invoiceType;
          wx.setStorageSync('invoiceDetails', invoiceDetails);
          that.setData({
            invoiceInfo: invoiceInfo,
            sendInfo: sendInfo,
            needBill: needBill,
            PO: PO,
            invoiceType: invoiceType,
          })
        }
        
        if (r.status == 0) {         
          that.setData({
            pageComplete: true,
            bqId: options.objectId,
            isConfirm: r.data.is_confirm,
            approval_button_enable: r.data.approval_button_enable,
            item_description: r.data.item_description,
            price: r.data.accept_price,
            maxprice: r.data.max_price,
            accountId: r.data.accountId,
            ContactId: r.data.contactId,
          })          
        } else {
          that.setData({
            pageComplete: false,
            info: r.errorInfo
          })
        }
      }
    })

  },
  getInvoiceInfoStorage: function(that){
    invoiceDetails = wx.getStorageSync('invoiceDetails');
    that.setData({
      invoiceInfo: invoiceDetails.invoiceInfo,
      sendInfo: invoiceDetails.sendInfo,
      invoiceType: invoiceDetails.invoiceType,
      PO: invoiceDetails.PO,
      needBill: invoiceDetails.needBill,
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var invoiceType;
    if(e.detail.value==0){
      invoiceType ='normalInvoice';
    }else{
      invoiceType = 'specialInvoice';
    };
    wx.navigateTo({
      url: '../invoiceDetails/invoiceDetails?invoiceType=' + invoiceType+'&url=bugetConfirm'
    })
    this.inputInvoice();
  },
  inputInvoice: function(){
    if(this.data.invoiceType!=''){
      wx.navigateTo({
        url: '../invoiceConfirm/invoiceConfirm?isConfirm=' + this.data.isConfirm+'?url=budgetConfirm'
      })
    }else{
      this.setData({
        shInputInfo: !this.data.shInputInfo,
      })
    }
  },
  contractConfirm:function(e){
    this.setData({ 
      checkBox: e.detail.value.length==1
    })
  },
  confirm:function(){
    var that=this;
    if (!this.data.checkBox){
      wx.showToast({
        title: '请勾选已阅读并接收此报价单',
        icon: 'none',
        duration: 2000
      })
      return false;
    }


    util.NetRequest({
      url: 'site-mini/confirm-budget',
      data: {
        BudgetoryquoteId: this.data.bqId,
        AccountId: this.data.accountId,
        ContactId: this.data.ContactId,
        invoiceDetails: JSON.stringify(invoiceDetails),
      },
      success: function (r) {
        if (r.success) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isConfirm:1
          })
          //wx.removeStorageSync('invoiceDetails');
        } else {
          wx.showToast({
            title: '失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  openPDF:function(){
    var url = util.Server + 'site/open-file?ServconfId=' + this.data.bqId;
    console.log(url);
    var downloadTask = wx.downloadFile({
      url: url,
      success: function success(res) {
        console.log(res);
        var filePath = res.tempFilePath;
        console.log('filePath= ' + filePath);
        wx.openDocument({
          filePath: filePath,
          success: function success(res) {
            console.log('打开文档成功');
          },
          fail: function fail(res) {
            console.log(res);
            wx.showModal({
              title: '提示',
              content: '报告显示错误。如果需要此报告，请联系客服索取。',
              showCancel: false
            });
          }
          })
      },
      complete: function complete() {
        wx.hideLoading();
      },
      fail: function fail() {
        wx.showModal({
          title: '提示',
          content: '报告下载失败，请检测网络。',
          showCancel: false
        });
      }
    })
  },
  //检测工作时间
  MtaReport: function () {
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'NONTECH' });
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
    if (wx.getStorageSync('invoiceDetails') != '') {
      this.getInvoiceInfoStorage(this);
    }
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