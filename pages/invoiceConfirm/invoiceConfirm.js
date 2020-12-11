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

if(wx.getStorageSync('invoiceDetails')){
  var invoiceDetails = wx.getStorageSync('invoiceDetails');
}else{
  var invoiceDetails={};
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddInvoice: 0,
    invoiceId: '',
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
    invoiceType: '',
    invoiceInfo:{
      "bankAccount":"",
      "bankName":"",
      "companyAddress":"",
      "errMsg":"",
      "taxNumber":"",
      "telephone":"",
      "title":"",
      "type": 0,
    },
    sendInfo:{
      'name':'',
      'telephone':'',
      'address':'',
      'mail':''
    },
    PO:'',
    needBill: false,
    invoiceType:'',
    isEdit:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('发票确认：', options);
    var that=this;
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
      that.data.invoiceId = options.invoiceId;
      if(typeof (options.isEdit) != 'undefined'){
        var currentInvoice = options.currentInvoice;
        // invoiceDetails = wx.getStorageSync('invoiceDetails');
        if(wx.getStorageSync('invoiceDetails')){
          invoiceDetails = wx.getStorageSync('invoiceDetails');
        }else{
          invoiceDetails={};
        }
        console.log('编辑的发票数据:',invoiceDetails);
        that.setData({
          invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
          sendInfo: invoiceDetails[currentInvoice].sendInfo,
          PO: invoiceDetails[currentInvoice].PO,
          needBill: invoiceDetails[currentInvoice].needBill,
          invoice: invoiceArry[currentInvoice],
          currentInvoice: currentInvoice,
        })
      }else{
        util.NetRequest({
          url: 'api/v1/user/invoice/' + options.invoiceId,
          method: 'GET',
          success: function (r) {
            console.log('该发票数据:', r);
            var currentInvoice = r.data.type==0?'normalInvoice':'specialInvoice';
            console.log('请求完发票数据',invoiceDetails);
            that.setInvoiceInfo(r.data)
            that.setData({
              invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
              sendInfo: invoiceDetails[currentInvoice].sendInfo,
              PO: invoiceDetails[currentInvoice].PO,
              needBill: invoiceDetails[currentInvoice].needBill,
              invoice: invoiceArry[currentInvoice],
              currentInvoice: currentInvoice,
            })
          }
        })
      }   
    } else {
      var currentInvoice = options.currentInvoice;
      invoiceDetails = wx.getStorageSync('invoiceDetails');
      console.log('发票数据:',invoiceDetails);
      that.setData({
        invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
        sendInfo: invoiceDetails[currentInvoice].sendInfo,
        PO: invoiceDetails[currentInvoice].PO,
        needBill: invoiceDetails[currentInvoice].needBill,
        invoice: invoiceArry[currentInvoice],
        currentInvoice: currentInvoice,
      })
    }
  },
  setInvoiceInfo: function (info) {
    var that = this;
    var invoiceInfo = that.data.invoiceInfo,
      sendInfo = that.data.sendInfo,
      PO = that.data.PO,
      invoiceType = that.data.invoiceType,
      needBill = that.data.needBill;
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
    PO = info.po_code;
    needBill = info.sales_list == 0 ? 'false' : true,
    invoiceType = info.type == 0 ? 'normalInvoice' : 'specialInvoice';
    console.log('invoiceDetails',invoiceDetails,invoiceType);
    invoiceDetails[invoiceType]={};
    invoiceDetails[invoiceType].invoiceInfo = invoiceInfo;
    invoiceDetails[invoiceType].sendInfo = sendInfo;
    invoiceDetails[invoiceType].PO = PO;
    invoiceDetails[invoiceType].needBill = needBill;
    invoiceDetails[invoiceType].invoiceType = invoiceType;
    wx.setStorageSync('invoiceDetails', invoiceDetails);
  },
  submit: function () {
    // /api/v1/user/invoice POST
    if (this.data.isAddInvoice == 1 || this.data.invoiceId != '') {
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
      if (this.data.invoiceId != '') {
        util.NetRequest({
          url: 'api/v1/user/invoice/' + this.data.invoiceId,
          method: "PUT",
          data: params,
          success: function (r) {
            if (r.status) {
              wx.showToast({
                title: '更新成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateTo({
                url: '../invoice_list/invoice_list',
              })
            }
          }
        })
      } else {
        util.NetRequest({
          url: 'api/v1/user/invoice',
          method: "POST",
          data: params,
          success: function (r) {
            console.log('新增发票：',r);
            if (r.status) {
              wx.showToast({
                title: '新增成功',
                icon: 'success',
                duration: 2000
              })
              var pages = getCurrentPages();
              var nums;
              console.log('新增发票pages：',pages);
              for (let i in pages) {
                if (pages[i].route == 'pages/invoice_list/invoice_list') {
                  console.log('新增发票i:',i);
                  nums = parseInt(i)+1;
                }
              }
              console.log('新增发票nums：',nums);
              wx.navigateBack({
                delta: pages.length - nums
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
          nums = parseInt(i) + 1;
        }
      }
      wx.navigateBack({
        delta: pages.length - nums
      })
    }
  },
  goBackEdit: function () {
    if (this.data.invoiceId != '') {
      wx.navigateTo({
        url: '../invoiceDetails/invoiceDetails?currentInvoice=' + this.data.currentInvoice + '&isAddInvoice=' + this.data.isAddInvoice + '&invoiceId=' + this.data.invoiceId,
      })
    } else {
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