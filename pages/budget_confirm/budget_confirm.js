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
      "type": 0,
      "title": '',
      "taxpayer_recognition_number": '',
      "bank": '',
      "bank_account": '',
      "registered_address": '',
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
    PO: '',
    needBill: '',
    invoiceDetails: {},
    currentInvoice: '',
    hasInvoice: false,
    confirmShow: false,
    objectid: '',
    isSignatured: false,
    signatureImg: '',
    showRightBtn: false,
    rightBtnText: '',
    showBackendSignature: false
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
    that.data.objectid = options.objectId;
    util.NetRequest({
      url: 'api/v1/sr/bq?objectid=' + options.objectId,
      method: 'GET',
      success: function (r) {
        console.log(r);
        console.log(r.data.invoice)

        if (r.data.status != false) {
          if (r.data.invoice.length > 0) {
            that.setData({
              hasInvoice:true,
              invoiceInfo: r.data.invoice[0]
            })
          }
          if (r.data.approval_button_enable == 'N'&&typeof (r.data.bq_confirmed_id) != 'undefined' && r.data.bq_confirmed_id != '') {
            console.log('已确认id：', r.data.bq_confirmed_id)
            var token = wx.getStorageSync('token');
            let url=util.Server+'api/v1/sr/bq/sign-img?bq_confirmed_id=' + r.data.bq_confirmed_id;
            console.log(url);
            wx.showLoading({
              title: '加载中，请稍候',
              mask: true
            })
            const downloadTask1 = wx.downloadFile({
              url: url,
              header: {
                'Authorization': "Bearer " + token
              },
              success: function (res) {
                console.log(res);
                console.log('filePath= ' + res.tempFilePath);
                if(res.tempFilePath){
                  that.setData({
                    showBackendSignature: true,
                    signatureImg: res.tempFilePath,
                    isSignatured: true,
                  })
                }                        
              },
              complete: function complete() {
                wx.hideLoading();
              },
              fail: function fail() {
                wx.showModal({
                  title: '提示',
                  content: '签名生成中',
                  showCancel: false
                });
              }
            })
            
          }
          that.setData({
            pageComplete: true,
            pageShow: true,
            bqId: that.data.objectid,
            isConfirm: r.data.is_confirmed,
            checkBox: r.data.is_confirmed,
            approval_button_enable: r.data.approval_button_enable
          })
        } else if (r.data.status == false) {
          that.setData({
            pageComplete: true,
            pageShow: false,
            bqId: options.objectId,
            isConfirm: r.data.is_confirmed,
            approval_button_enable: r.data.approval_button_enable
          })
        }
      }
    })

  },

  inputInvoice: function () {
    if (typeof (this.data.invoiceInfo.id) != 'undefined') {
      wx.navigateTo({
        url: '../invoice_list/invoice_list?invoiceId=' + this.data.invoiceInfo.id,
      })
    } else {
      wx.navigateTo({
        url: '../invoice_list/invoice_list'
      })
    }
    // this.changeInvoiceType();

  },
  contractConfirm: function (e) {
    this.setData({
      checkBox: e.detail.value.length == 1
    })
  },
  returnHome: function () {
    wx.switchTab({
      url: '../index/index',
    })
    // util.NetRequest({
    //   url: 'api/v1/sr/fill-invoice-remind',
    //   method: "POST",
    //   data: {
    //     objectid: this.data.objectid
    //   },
    //   success: function (r) {
    //     console.log('不提交发票返回首页：', r);
    //     wx.switchTab({
    //       url: '../index/index',
    //     })
    //   }
    // })
  },
  infoOkTap: function () {
    var that = this;
    if (typeof (that.data.invoiceInfo.id) != 'undefined'||that.data.hasInvoice==true) {
      console.log('提交报价单invoiceInfo:', that.data.invoiceInfo);
      if (that.data.approval_button_enable == 'N' && that.data.signatureImg != '') {
        var invoiceData = JSON.stringify(that.data.invoiceInfo)
      } else {
        var invoiceData = that.data.invoiceInfo;
      }
      var params = {
        objectid: that.data.objectid,
        invoice: invoiceData
      };
    } else {
      var params = {
        objectid: that.data.objectid
      };
    }
    console.log('确认报价单params：', params);
    if (that.data.approval_button_enable == 'Y' || that.data.signatureImg == '') {
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
        url: url,
        data: params,
        filePath: that.data.signatureImg,
        fileName: 'signature',
        success: function (res) {
          console.log('上传签名结束：', res);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isConfirm: 1,
            confirmShow: false,
          })
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
    if (typeof (this.data.invoiceInfo.id) == 'undefined'&&this.data.hasInvoice==false) {
      this.setData({
        showModalTip: true,
        showRightBtn: true
      })
      return false;
    }
    if (this.data.approval_button_enable == 'N' && this.data.signatureImg == '') {
      wx.showModal({
        title: '提交失败',
        content: '请确认签字',
        showCancel: false
      })
      return false;
    }
    if (!this.data.checkBox) {
      wx.showModal({
        title: '提交失败',
        content: '请确认勾选已阅读并接受此报价单',
        showCancel: false
      })
      return false;
    }
    this.setData({
      confirmShow: true
    })
  },
  // 下载pdf
  downloadPDF: function () {
    var token = wx.getStorageSync('token');
    // util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid + '&token=' + token;
    // api/v1/sr/preview-pdf?objectid= &is_safety=1(1为安全声明) GET
    if (this.data.isConfirm ==1) {
      var url = util.Server + 'api/v1/sr/sign-pdf?objectid=' + this.data.objectid+'&type=png'
    } else {
      var url = util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid+'&type=png'
    }
    console.log(url);
    wx.showLoading({
      title: '加载中，请稍候',
      mask: true
    })
    const downloadTask2 = wx.downloadFile({
      url: url,
      header: {
        'Authorization': "Bearer " + token
      },
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        console.log('下载pdf的filePath= ' + filePath);
        if (res.statusCode == 200) {
          util.saveImageToPhotos(filePath);
        } else {        
            wx.showModal({
              title: '提示',
              content: 'PDF生成中请稍后查看',
              showCancel: false
            });
            return false
        }

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
  // 打开pdf
  openPDF: function () {
    var token = wx.getStorageSync('token');
    // util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid + '&token=' + token;
    // api/v1/sr/preview-pdf?objectid= &is_safety=1(1为安全声明) GET
    if (this.data.isConfirm == 1) {
      var url = util.Server + 'api/v1/sr/sign-pdf?objectid=' + this.data.objectid
    } else {
      var url = util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid
    }
    console.log(url);
    wx.showLoading({
      title: '加载中，请稍候',
      mask: true
    })
    const downloadTask = wx.downloadFile({
      url: url,
      header: {
        'Authorization': "Bearer " + token
      },
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        console.log('filePath= ' + filePath);
        if (res.statusCode == 200) {
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
        } else {        
            wx.showModal({
              title: '提示',
              content: 'PDF生成中请稍后查看',
              showCancel: false
            });
            return false
        }

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
