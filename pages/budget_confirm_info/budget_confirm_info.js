// pages/budget_confrim_info/budget_confirm_info.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalTip: false,
    tipText: '请尽快确认发票信息，以便安排后续送修服务',
    objectid: '',
    bqId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options);
    if (typeof (options.objectId) != 'undefined') {
      this.setData({
        objectid: options.objectId,
        bqId:options.objectId
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
  openPDF: function (e) {
    var token = wx.getStorageSync('token');
    var url = util.Server + 'api/v1/sr/preview-pdf?objectid=' + this.data.objectid+'&is_safety='+e.currentTarget.dataset.safe;
    console.log(url);
    // url api/v1/sr/preview-pdf?objectid= &is_safety=1(1为安全声明) GET
    // return ['status' => false, 'error' => 'PDF生成中请稍后', 'no_error' => true];
    wx.showLoading({
      title: '加载中，请稍候',
      mask: true
    })
    var downloadTask = wx.downloadFile({
      url: url,
      header: {
        'Authorization': "Bearer " + token
      },
      success: function success(res) {
        console.log('下载pdf：',res);
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
          content: 'PDF生成中请稍后',
          showCancel: false
        });
      }
    })
  },
  submit: function (e) {
    var that = this;
    if (e.currentTarget.dataset.confirm == 0) {
      util.NetRequest({
        url: 'api/v1/sr/bq',
        method: "POST",
        data: {
          objectid: that.data.objectid,
        },
        success(r) {
          that.setData({
            showModalTip: true,
            tipText: '请尽快确认发票信息，以便安排后续送修服务'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../invoice_confirm_info/invoice_confirm_info?objectId=' + this.data.objectid+'&fromPage='+'budget_confirm_info',
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