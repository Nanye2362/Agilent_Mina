// pages/invoiceDetails/invoiceDetails.js
var util = require('../../utils/util.js');
var isSend = false;
var config = require('../../config.js');

var invoiceArry = {
  "normalInvoice":{
    'title':"发票抬头",
    'taxNumber':"纳税人识别号",
  },
  "specialInvoice":{
    "title":"发票抬头",
    "taxNumber":"纳税人识别号",
    "bankName":"开户行",
    "bankAccount":"银行账号",
    "companyAddress":"注册地址",
    "telephone":"注册电话",
  }
};
var invoiceDetails = wx.getStorageSync('invoiceDetails');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendWhom: [
      { name: 'me', value: '我自己',checked: 'true' },
      { name: 'other', value: '其他人' }
    ],
    sendObj: {
      "name": "寄送人姓名",
      "telephone": "联系电话",
      "address": "地址",
    },
    sendTo:'me',
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
    },
    PO:'',
    needBill: false,
    errText:{
      invoiceTitle:'发票抬头不能为空',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    invoiceDetails = wx.getStorageSync('invoiceDetails');
    if (invoiceDetails != '') {
      this.setData({
        invoiceInfo: invoiceDetails.invoiceInfo,
        invoiceType: invoiceDetails.invoiceType,
        invoice: invoiceArry[invoiceDetails.invoiceType],
        PO: invoiceDetails.PO,
        needBill: invoiceDetails.needBill,
      })
    } else {
      this.setData({
        invoiceType: options.invoiceType,
        //invoiceType: this.data.invoiceType,
        //invoice: invoiceArry[this.data.invoiceType],
        invoice: invoiceArry[options.invoiceType],
      })
    }
    this.getMeInfo(); 
  },
  //获取用户自己信息
  getMeInfo: function(){
    if (invoiceDetails!=''){
      var sendInfo = invoiceDetails.sendInfo;
      this.setData({
        sendInfo: sendInfo,
      })
    }else{
      var userInfo = wx.getStorageSync('userInfo');
      var sendInfo = this.data.sendInfo;
      sendInfo.name = userInfo.name;
      sendInfo.telephone = userInfo.mobile;
      this.setData({
        sendInfo: sendInfo,
      })
    }   
  },
  //从微信中获取发票信息
  chooseInvoice: function () {
    var that = this;
    wx.chooseInvoiceTitle({
      success(res) {
        console.log(res);
        that.setData({
          invoiceInfo: res
        })
      }
    })
  },
  //输入发票数据
  bindInvoiceInput: function (e) {
    var invoiceInfo = this.data.invoiceInfo
    console.log(e.currentTarget.dataset.type);
    var inputType = e.currentTarget.dataset.type;
    invoiceInfo[inputType] = e.detail.value;
    this.setData({
      invoiceInfo: invoiceInfo
    });
  },
  //输入寄送信息
  bindSendInput: function (e) {
    var sendInfo = this.data.sendInfo;
    var inputType = e.currentTarget.dataset.type;
    sendInfo[inputType] = e.detail.value;
    this.setData({
      sendInfo: sendInfo
    })
  },
  //选择寄送人
  radioChange: function (e) {
    var sendInfo = this.data.sendInfo;
    if(e.detail.value=='other'){
      sendInfo.name='';
      sendInfo.telephone = '';
      this.setData({
        sendInfo: sendInfo
      })
    }else{
      this.getMeInfo();
    }
  },
  //输入PO号
  bindInputPO: function(e){
    this.setData({
      PO:e.detail.value
    })
  },
  //详见销货清单
  checkBill: function (e) {
    var needBill = this.data.needBill;
    this.setData({
      needBill: !needBill,
    })
  },
  //提交
  submit: function(){  
    // if (util.checkEmpty(that.data, ['name', 'company', 'orderno']) || that.data.pickerType == -1 || that.data.chooseCheckbox.length == 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请确认信息输入完整',
    //     showCancel: false,
    //   })
    //   return;
    // }
    var check = this.checkEmpty(this.data, this.data.PO);
    console.log(check);
    this.checkEmpty(this.data,PO);
    var invoiceDetails = {};
    invoiceDetails.invoiceInfo = this.data.invoiceInfo;
    invoiceDetails.sendInfo = this.data.sendInfo;
    invoiceDetails.PO = this.data.PO;
    invoiceDetails.needBill = this.data.needBill;
    invoiceDetails.invoiceType = this.data.invoiceType;
    wx.setStorageSync('invoiceDetails', invoiceDetails);
    wx.navigateTo({
      url: '../invoiceConfirm/invoiceConfirm?url=invoiceConfirm'
    })
  },
  emptyRemind: function(errText,emptyText){
    wx.showModal({
      title: '提交失败',
      content: errRemind.emptyText+'不能为空',
      showCancel: false,
      success: function (res) {
      }
    })
  },
  checkEmpty: function (obj, arrInput){
      var isEmpty = false;
      var fieldName = '';
      for(var i in arrInput){
        if (obj[arrInput[i]].trim().length == 0) {
          isEmpty = true;
          fieldName = i;
          return { isEmpty: isEmpty,fieldName:fieldName};
        }
      }
    return { isEmpty: isEmpty, fieldName: fieldName };
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