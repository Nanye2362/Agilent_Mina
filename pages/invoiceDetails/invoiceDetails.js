// pages/invoiceDetails/invoiceDetails.js
var util = require('../../utils/util.js');
var isSend = false;
var config = require('../../config.js');

var invoiceArry = {
  "normalInvoice":{
    'title':"发票抬头",
    'taxNumber':"纳税人识别号",
    "bankName": "开户行(选填)",
    "bankAccount": "银行账号(选填)",
    "companyAddress": "注册地址(选填)",
    "telephone": "注册电话(选填)",
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

var errText={
  "title": "发票抬头",
  "taxNumber": "纳税人识别号",
  "bankName": "开户行",
  "bankAccount": "银行账号",
  "companyAddress": "注册地址",
  "telephone": "注册电话",
}

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
      "mail":"电子邮箱(选填)"
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
      'mail':''
    },
    PO:'',
    needBill: false,
    currentInvoice:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var currentInvoice = options.currentInvoice;
    invoiceDetails = wx.getStorageSync('invoiceDetails');  
    if (invoiceDetails[currentInvoice]!=undefined){
      console.log(invoiceDetails[currentInvoice]);
      this.setData({
        invoiceInfo: invoiceDetails[currentInvoice].invoiceInfo,
        invoice: invoiceArry[currentInvoice],
        PO: invoiceDetails[currentInvoice].PO,
        needBill: invoiceDetails[currentInvoice].needBill,
        currentInvoice: options.currentInvoice,
        invoiceDetails: invoiceDetails,
      })
    }else{
      this.setData({
        currentInvoice: options.currentInvoice,
        invoice: invoiceArry[options.currentInvoice],
        invoiceDetails: invoiceDetails,
      })
    }   
    this.getMeInfo(); 
  },
  //获取用户自己信息
  getMeInfo: function(){
    var invoiceDetails = wx.getStorageSync('invoiceDetails');
    console.log(invoiceDetails)
    var currentInvoice = this.data.currentInvoice;
    if (invoiceDetails[currentInvoice]!=undefined){
      var sendInfo = invoiceDetails[currentInvoice].sendInfo;
      console.log(sendInfo);
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
    console.log(sendInfo);
    console.log(e.detail.value);
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
    var that = this;
    var checkObjInvoice = Object.keys(invoiceArry[this.data.currentInvoice]);
    if (this.data.currentInvoice =="normalInvoice"){
      checkObjInvoice = ["title","taxNumber"];
    }

    var checkObjSend = ['name', 'telephone', 'address'];

    var checkInvoice = this.checkEmpty(this.data.invoiceInfo, checkObjInvoice);
    var checkSend = this.checkEmpty(this.data.sendInfo, checkObjSend);
    console.log(typeof errText[checkInvoice.fieldName] );
    if (checkInvoice.isEmpty == true || checkSend.isEmpty ==true){
      wx.showModal({
        title: '提交失败',
        content: errText[checkInvoice.fieldName] == undefined ? "寄送信息不全，请完善信息" : errText[checkInvoice.fieldName] +'不能为空，请完善信息',
        showCancel: false,
      })
    }else{
      var currentInvoice = this.data.currentInvoice;
      var invoiceDetails = this.data.invoiceDetails;
      invoiceDetails[currentInvoice] = {};
      invoiceDetails[currentInvoice].invoiceInfo = this.data.invoiceInfo;
      invoiceDetails[currentInvoice].sendInfo = this.data.sendInfo;
      invoiceDetails[currentInvoice].PO = this.data.PO;
      invoiceDetails[currentInvoice].needBill = this.data.needBill;
      invoiceDetails[currentInvoice].invoiceType = this.data.currentInvoice;
      wx.setStorageSync('invoiceDetails', invoiceDetails);
      wx.navigateTo({
        url: '../invoiceConfirm/invoiceConfirm?url=invoiceDetails&&currentInvoice=' + currentInvoice
      })
    }   
  },
  checkEmpty: function (obj, arrInput){
    var isEmpty = false;
    var fieldName = '';
    for(var i in arrInput){
      if (obj[arrInput[i]].trim().length == 0) {
        isEmpty = true;
        fieldName = arrInput[i];
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