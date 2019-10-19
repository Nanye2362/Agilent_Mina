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
    pageShow: false, //本人显示，非本人不显示
    shInputInfo: false,
    //0:normalInvoice,1:specialInvoice
    invoicetype: [
      { name: '0', value: '增值税普通发票' },
      { name: '1', value: '增值税专用发票' },
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
    invoiceDetails:{},
    currentInvoice:'',
    hasInvoice: true,
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
    util.getUserInfo(function (user) {
      console.log(user);
    });
    util.NetRequest({
      url: 'site-mini/get-budget',
      data: {
        srId: options.srId,
        objectId: options.objectId
      },
      success: function (r) {
        console.log(r);
        var invoiceDetails = {},
            currentInvoice = '';
        console.log(r.data.InvoiceInfo)
        if (typeof(r.data.InvoiceInfo)!="undefined"){
          currentInvoice = r.data.InvoiceInfo.InvoiceType == 0 ? 'normalInvoice' : 'specialInvoice';
        }else{
          that.setData({
            hasInvoice: false,
          })
        }
        console.log(r.data.InvoiceInfo);
        console.log(currentInvoice);

        if (r.data.InvoiceInfo.length!=''){
          //for (var i in r.data.InvoiceInfo){
            that.setInvoiceInfo(r.data.InvoiceInfo)
          //}
          invoiceDetails = that.data.invoiceDetails
          console.log(invoiceDetails);
          that.setData({
            invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
            sendInfo: invoiceDetails[currentInvoice].sendInfo,
            needBill: invoiceDetails[currentInvoice].needBill,
            PO: invoiceDetails[currentInvoice].PO,
            currentInvoice: currentInvoice,
          })
        }
        else{
          // if (wx.getStorageSync('invoiceDetails') != '') {
          //   that.getInvoiceInfoStorage(that);
          // }
          wx.setStorageSync('invoiceDetails', {});
        }

        if (r.status == 0) {
          that.setData({
            pageComplete: true,
            pageShow: true,
            bqId: options.objectId,
            isConfirm: r.data.is_confirm,
            approval_button_enable: r.data.approval_button_enable,
            item_description: r.data.item_description,
            price: r.data.accept_price,
            maxprice: r.data.max_price,
            accountId: r.data.accountId,
            ContactId: r.data.contactId,
          })
        }else if(r.status == -90){
          that.setData({
            pageComplete: true,
            pageShow: false,
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
            pageShow: false,
            info: r.errorInfo
          })
        }
      }
    })

  },
  setInvoiceInfo: function (invoiceinfo){
    var that = this;
    var invoiceDetails = that.data.invoiceDetails,
        invoiceInfo = that.data.invoiceInfo,
        sendInfo = that.data.sendInfo,
        PO = that.data.PO,
        invoiceType = that.data.invoiceType,
        needBill = that.data.needBill;

    invoiceInfo.title = invoiceinfo.InvoiceTitle;
    invoiceInfo.companyAddress = invoiceinfo.RegisteredAddress;
    invoiceInfo.taxNumber = invoiceinfo.TaxpayerRecognitionNumber;
    invoiceInfo.bankName = invoiceinfo.Bank;
    invoiceInfo.bankAccount = invoiceinfo.BankAccount;
    invoiceInfo.telephone = invoiceinfo.RegisteredPhone;
    sendInfo.name = invoiceinfo.Recipient;
    sendInfo.address = invoiceinfo.Address;
    sendInfo.telephone = invoiceinfo.Tel;
    sendInfo.mail = invoiceinfo.mail;
    PO = invoiceinfo.POCode;
    needBill = invoiceinfo.AccountSales == 0 ? 'false' : true,
    invoiceType = invoiceinfo.InvoiceType == 0 ? 'normalInvoice' : 'specialInvoice';
    invoiceDetails[invoiceType] = {}
    invoiceDetails[invoiceType].invoiceInfo = invoiceInfo;
    invoiceDetails[invoiceType].sendInfo = sendInfo;
    invoiceDetails[invoiceType].PO = PO;
    invoiceDetails[invoiceType].needBill = needBill;
    invoiceDetails[invoiceType].invoiceType = invoiceType;
    wx.setStorageSync('invoiceDetails', invoiceDetails);
    that.setData({
      invoiceDetails: invoiceDetails
    })
  },
  getInvoiceInfoStorage: function(that){
    var currentInvoice = that.data.currentInvoice;
    invoiceDetails = wx.getStorageSync('invoiceDetails');
    console.log(invoiceDetails[currentInvoice]);
    that.setData({
      invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
      sendInfo: invoiceDetails[currentInvoice].sendInfo,
      invoiceType: invoiceDetails[currentInvoice].invoiceType,
      PO: invoiceDetails[currentInvoice].PO,
      needBill: invoiceDetails[currentInvoice].needBill,
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var currentInvoice;
    if(e.detail.value==0){
      currentInvoice ='normalInvoice';
    }else{
      currentInvoice = 'specialInvoice';
    };
    wx.navigateTo({
      url: '../invoiceDetails/invoiceDetails?currentInvoice=' + currentInvoice
    })
    this.changeInvoiceType();
  },

  inputInvoice: function(){
    if (this.data.currentInvoice!=''){
      wx.navigateTo({
        url: '../invoiceConfirm/invoiceConfirm?isConfirm=' + this.data.isConfirm + '&&currentInvoice=' + this.data.currentInvoice
      })
    }else{
      this.changeInvoiceType();
    }
  },
  changeInvoiceType: function(){
    this.setData({
      shInputInfo: !this.data.shInputInfo,
    })
  },
  contractConfirm:function(e){
    this.setData({
      checkBox: e.detail.value.length==1
    })
  },
  confirm:function(){
    var that=this;
    console.log(invoiceDetails);
    console.log(Object.keys(invoiceDetails).length)
    if (!this.data.checkBox || Object.keys(invoiceDetails).length == 0){
      wx.showModal({
        title: '提交失败',
        content: '请确认发票信息的完整，并勾选已阅读并接收此报价单',
      })
      //return false;
    }else{
      var invoicedetails = invoiceDetails;
      var currentInvoice = this.data.currentInvoice;
      console.log(invoicedetails);
      invoicedetails[currentInvoice].needBill = invoiceDetails.needBill==true?1:0;
      invoicedetails[currentInvoice].invoiceType = invoiceDetails[currentInvoice].invoiceType=='specialInvoice'?1:0;
      util.NetRequest({
        url: 'site-mini/confirm-budget',
        data: {
          BudgetoryquoteId: this.data.bqId,
          AccountId: this.data.accountId,
          ContactId: this.data.ContactId,
          invoiceDetails: JSON.stringify(invoicedetails[currentInvoice]),
        },
        success: function (r) {
          if (r.success) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              isConfirm: 1
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
    }
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
    if (this.data.currentInvoice != '' && wx.getStorageSync('invoiceDetails') != '' ) {
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
