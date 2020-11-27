var util = require('../../utils/util.js');
var invoiceDetails = wx.getStorageSync('invoiceDetails');

// pages/budget_confirm/budget_confirm.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSignature: false,
    nickName: '',
    avatarUrl: '',
    transferAction: '',
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
    sendInfo: {
      "name": "",
      "telephone": "",
      "address": "",
    },
    PO: '',
    needBill: '',
    invoiceDetails: {},
    currentInvoice: '',
    hasInvoice: true,
    confirmShow: false,
    objectid: '',
    isSignatured: false,
    signatureImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log(options);
    // util.getUserInfo(function (user) {

    // });
    this.data.objectid = options.objectId;
    util.NetRequest({
      url: 'api/v1/sr/bq?objectid=' + options.objectId,
      method: 'GET',
      success: function (r) {
        console.log(r);
        var invoiceDetails = {},
          currentInvoice = '';
        console.log(r.data.invoice)

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
            // if (wx.getStorageSync('invoiceDetails') != '') {
            //   that.getInvoiceInfoStorage(that);
            // }
            wx.setStorageSync('invoiceDetails', {});
          }
          that.setData({
            pageComplete: true,
            pageShow: true,
            bqId: options.objectId,
            isConfirm: r.data.is_confirmed,
            price: r.data.gross_value,
            maxprice: r.data.max_price,
            approval_button_enable: r.data.approval_button_enable,
            item_description: r.data.item_description,
          })
        } else if (r.data.status == false) {
          that.setData({
            pageComplete: true,
            pageShow: false,
            bqId: options.objectId,
            isConfirm: r.data.is_confirmed,
            price: r.data.gross_value,
            maxprice: r.data.max_price,
            approval_button_enable: r.data.approval_button_enable,
            item_description: r.data.item_description,
          })
        }
      }
    })

  },
  setInvoiceInfo: function (info) {
    var that = this;
    var invoiceDetails = that.data.invoiceDetails,
      invoiceInfo = that.data.invoiceInfo,
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
  getInvoiceInfoStorage: function (that) {
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
    var title = wx.getStorageSync('sobot_company');

    if (e.detail.value == 0) {
      currentInvoice = 'normalInvoice';
    } else {
      currentInvoice = 'specialInvoice';
    };

    wx.navigateTo({
      url: '../invoiceDetails/invoiceDetails?currentInvoice=' + currentInvoice + '&title=' + title
    })
    this.changeInvoiceType();
  },

  inputInvoice: function () {
    if (this.data.currentInvoice != '') {
      wx.navigateTo({
        url: '../invoiceConfirm/invoiceConfirm?isConfirm=' + this.data.isConfirm + '&&currentInvoice=' + this.data.currentInvoice
      })
    } else {
      this.changeInvoiceType();
    }
  },
  changeInvoiceType: function () {
    this.setData({
      shInputInfo: !this.data.shInputInfo,
    })
  },
  contractConfirm: function (e) {
    this.setData({
      checkBox: e.detail.value.length == 1
    })
  },
  infoOkTap: function () {
    var that = this;
    console.log(invoiceDetails);
    console.log(Object.keys(invoiceDetails).length)
    if (Object.keys(invoiceDetails).length != 0) {
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
        },//有传，没有不传
      };
    } else {
      var params = {
        objectid: that.data.objectid
      };
    }
    console.log('确认报价单params：', params);
    if (that.data.approval_button_enable == 'Y') {
      util.NetRequest({
        url: 'api/v1/sr/bq',
        method: "POST",
        data: params,
        success: function (r) {
          if (r.status) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              isConfirm: 1,
              confirmShow: false,
            })
            //wx.removeStorageSync('invoiceDetails');
          } else {
            wx.showToast({
              title: '失败',
              icon: 'fail',
              duration: 2000
            })
            that.setData({
              confirmShow: false,
            })
          }
        }
      })
    } else {
      let url = 'api/v1/sr/bq';
      console.log('上传签名uploadFile：', url);
      util.uploadFileRequest({
        url:url,
        data: params,
        filePath:that.data.signatureImg,
        fileName:'signature',
        success:function(res){
            console.log('上传签名成功后：', res);
        },
      })
    }


  },
  infoCancelTap: function () {
    this.setData({
      confirmShow: false
    })
  },
  confirm: function () {
    // || Object.keys(invoiceDetails).length == 0
    if (!this.data.checkBox) {
      wx.showModal({
        title: '提交失败',
        content: '请确认发票信息的完整，并勾选已阅读并接收此报价单',
      })
      return false;
    }
    this.setData({
      confirmShow: true
    })
  },
  openPDF: function () {
    var token = wx.getStorageSync('token');
    // util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid + '&token=' + token;
    var url = util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid
    console.log(url);
    const downloadTask = wx.downloadFile({
      url: url,
      header: {
        'Authorization': "Bearer " + token
      },
      success: function (res) {
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
  copyTBL: function () {
    var token = wx.getStorageSync('token');
    var url = util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid + '&token=' + token;
    var self = this;
    wx.setClipboardData({
      data: url,
      success: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '报价单链接已黏贴到剪贴板，请打开浏览器后下载',
          showCancel: false
        });
      }

    });
  },
  // 签名
  toSignature: function () {
    this.setData({
      showSignature: true
    })
  },

  // 关闭签名
  closeSignature: function () {
    this.setData({
      showSignature: false
    })
  },
  // 完成签名
  completeSignature: function (e) {
    console.log('completeSignature:', e);
    this.setData({
      showSignature: false,
      isSignatured: true,
      signatureImg: e.detail
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
    if (this.data.currentInvoice != '' && wx.getStorageSync('invoiceDetails') != '') {
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
