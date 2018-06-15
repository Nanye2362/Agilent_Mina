var util = require('../../utils/util.js');


// pages/budget_confirm/budget_confirm.js
Page({
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
        ContactId: this.data.ContactId
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
   * 页面的初始数据
   */
  data: {
    bqId:"",
    info:"加载中",
    checkBox:false,
    pageComplete:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //腾讯mat统计开始
    var app = getApp();
    var that=this;
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
        if(r.status==0){
           that.setData({
             pageComplete:true,
             bqId: options.objectId,
             isConfirm: r.data.is_confirm,
             approval_button_enable: r.data.approval_button_enable,
             item_description: r.data.item_description,
             price: r.data.accept_price,
             maxprice: r.data.max_price,
             accountId: r.data.accountId,
             ContactId: r.data.contactId
           })
        }else{
          that.setData({
            pageComplete:false,
            info: r.errorInfo
          })
        }
      }
    })

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