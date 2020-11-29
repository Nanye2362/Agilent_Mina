// pages/invoiceConfirm/invoiceConfirm.js
var util = require('../../utils/util.js');
var isSend = false;
var config = require('../../config.js');
var invoiceArry = {
  "normalInvoice": {
    'title': "发票抬头",
    'taxNumber': "纳税人识别号",
    "bankName": "开户行(选填)",
    "bankAccount": "银行账号(选填)",
    "companyAddress": "注册地址(选填)",
    "telephone": "注册电话(选填)",
  },
  "specialInvoice": {
    "title": "发票抬头",
    "taxNumber": "纳税人识别号",
    "bankName": "开户行",
    "bankAccount": "银行账号",
    "companyAddress": "注册地址",
    "telephone": "注册电话",
  }
};
var invoiceDetails = wx.getStorageSync('invoiceDetails');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddInvoice: 0,
    invoiceId:'',
    sendWhom: [
      { name: 'me', value: '我自己', checked: 'true' },
      { name: 'other', value: '其他人' }
    ],
    sendObj: {
      "name": "寄送人姓名",
      "telephone": "联系电话",
      "address": "地址",
      "mail": "电子邮箱(选填)"
    },
    currentInvoice: '',
    isConfirm: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('发票确认：',options);
    if (typeof (options.isAddInvoice) != 'undefined') {
      this.data.isAddInvoice = options.isAddInvoice
    }
    if (options.url == 'invoiceDetails') {
      this.setData({
        isConfirm: 0,
      })
    } else {
      if (typeof (options.isConfirm) != 'undefined') {
        this.setData({
          isConfirm: options.isConfirm,
        })
      }
    }
    if (typeof (options.invoiceId) != 'undefined') {
      this.data.invoiceId=options.invoiceId;
      util.NetRequest({
        url: 'api/v1/user/invoice/'+options.invoiceId,
        method: 'GET',
        success: function (r) {
          console.log('发票数据:',r);
        }})
    } else {
      var currentInvoice = options.currentInvoice;
      this.setData({
        invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
        sendInfo: invoiceDetails[currentInvoice].sendInfo,
        PO: invoiceDetails[currentInvoice].PO,
        needBill: invoiceDetails[currentInvoice].needBill,
        invoice: invoiceArry[currentInvoice],
        currentInvoice: currentInvoice,
      })
    }

  },

  submit: function () {
    // /api/v1/user/invoice POST
    if (this.data.isAddInvoice == 1||this.data.invoiceId!='') {
      var invoicedetails = invoiceDetails;
      var currentInvoice = this.data.currentInvoice;
      console.log('currentInvoice:', currentInvoice);
      invoicedetails[currentInvoice].needBill = invoiceDetails.needBill == true ? 1 : 0;
      invoicedetails[currentInvoice].invoiceType = invoiceDetails[currentInvoice].invoiceType == 'specialInvoice' ? 1 : 0;
      let params = {
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
      };
      if(this.data.invoiceId!=''){
        util.NetRequest({
          url: 'api/v1/user/invoice/'+this.data.invoiceId,
          method: "PUT",
          data: params,
          success: function (r) {
            if (r.status) {
              wx.showToast({
                title: '新增成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateTo({
                url: '../invoice_list/invoice_list',
              })
            }
          }
        })
      }else{
        util.NetRequest({
          url: 'api/v1/user/invoice',
          method: "POST",
          data: params,
          success: function (r) {
            if (r.status) {
              wx.showToast({
                title: '新增成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateTo({
                url: '../invoice_list/invoice_list',
              })
            }
          }
        })
      }
      
    } else {
      console.log(getCurrentPages());
      var pages = getCurrentPages();
      var nums;
      for (var i in pages) {
        if (pages[i].route == 'pages/budget_confirm/budget_confirm') {
          pages[i].setData({
            currentInvoice: this.data.currentInvoice
          })
          nums = i + 1;
        }
      }
      wx.navigateBack({
        delta: pages.length - nums
      })
    }
  },
  goBackEdit: function () {
    if(this.data.invoiceId!=''){
      wx.navigateTo({
        url: '../invoiceDetails/invoiceDetails?currentInvoice=' + this.data.currentInvoice + '&isAddInvoice=' + this.data.isAddInvoice+'&invoiceId='+this.data.invoiceId,
      })
    }else{
      wx.navigateTo({
        url: '../invoiceDetails/invoiceDetails?currentInvoice=' + this.data.currentInvoice + '&isAddInvoice=' + this.data.isAddInvoice,
      })
    }
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