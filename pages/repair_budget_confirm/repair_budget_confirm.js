// pages/budget_confrim_info/budget_confirm_info.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSignature: false,
    transferAction: '',
    objectid: '',
    isSignatured: false,
    signatureImg: '',
    safety_statement:[],
    checkBox:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.objectId) != 'undefined') {
      this.setData({
        objectid: options.objectId
      })
    }
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
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log('onShow:',this.data.objectid,this.data.safety_statement);
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
    util.NetRequest({
      url: 'api/v1/sr/bq?objectid=' + this.data.objectid,
      method: 'GET',
      success: function (r) {
        console.log(r);
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
          }
          else {
            wx.setStorageSync('invoiceDetails', {});
          }
          that.setData({
            pageComplete: true,
            pageShow: true,
            bqId: this.data.objectId,
            isConfirm: r.data.is_confirmed,
            price: r.data.gross_value,
            maxprice: r.data.max_price,
            approval_button_enable: r.data.approval_button_enable,
            item_description: r.data.item_description,
          })
        } else if (r.data.status == false) {
          wx.showModal({
            title: '请求失败',
            content: r.data.error,
            showCancel: false,
            success: function (response) {
              console.log('400:', response);
              // if (response.confirm) {
              //   wx.switchTab({
              //     url: '../index/index',
              //   })
              // }
            }
          })
          that.setData({
            pageComplete: true,
            pageShow: false,
            isConfirm: r.data.is_confirmed
          })
        }
      }
    })
  },
  toSafetyPage(){
    wx.navigateTo({
      url: '../safety_statement/safety_statement?objectId='+this.data.objectid,
    })
  },
  // 勾选协议
  contractConfirm: function (e) {
    this.setData({
      checkBox: e.detail.value.length == 1
    })
  },
  openPDF: function () {
    // '/api/v1/sr/bq-file?objectid='+item.ServconfId+'&token='+token
    // var url = util.Server + 'site/open-file?ServconfId=' + this.data.bqId;
    var token = wx.getStorageSync('token');
    var url = util.Server + 'api/v1/sr/bq-file?objectid=' + this.data.objectid
    console.log(url);
    var downloadTask = wx.downloadFile({
      url: url,
      header: {
        'Authorization': "Bearer " + token
      },
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
  submit() {
    // uploadFile
    // api/v1/sr/gen-pdf POST
    // objectid safety_statement:[] signature file
    let url = util.Server + 'api/v1/sr/gen-pdf';
    var that = this;
    console.log('上传签名uploadFile：', url);
    if (that.data.safety_statement.length<=0) {
      wx.showModal({
        title: '提交失败',
        content: '请编辑确认送修仪器是否含有相关危险物质',
        showCancel:false
      })
      return false;
    }else if(that.data.signatureImg==''){
      wx.showModal({
        title: '提交失败',
        content: '请确认签字',
        showCancel:false
      })
      return false;
    }else if(!that.data.checkBox) {
      wx.showModal({
        title: '提交失败',
        content: '请确认勾选已阅读并签名确认以上文件内容',
        showCancel:false
      })
      return false;
    } else {
      let url='api/v1/sr/gen-pdf';
      var params={
        objectid:that.data.objectid,
        safety_statement:that.data.safety_statement,
      };
      util.uploadFileRequest({
        url: url,
        data: params,
        filePath: that.data.signatureImg,
        fileName: 'signature',
        success: function (res) {
          console.log('上传签名成功后：', res);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateTo({
            url: '../budget_confirm_info/budget_confirm_info?objectId=' + that.data.objectid,
          })
        },
      })
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