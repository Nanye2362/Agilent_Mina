// pages/orderList/orderList.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换 
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    util.NetRequest({
      url: 'site-mini/my-appointment',
      data: {
      },
      success: function (res) {
        console.log(res);
        that.setData({
          tabList: res,
        })
      }
    });
    /* 
      预约状态的后台四种模式，前端三种
      后台：0-未处理 1-已处理 2-忽略 3-锁定
      前端：0- 未处理---未处理
            1- 已处理(完成)---已预约
            2，3- 忽略锁定---处理中
     */
    /* 
      服务类型：
      pm：预防性维护
      install：安装申请
      oq：法规认证
     */
    // util.NetRequest({
    //   url: 'site-mini/my-appointment',
    //   data: {},
    //   success: function (res) {
    //     console.log(res); 
    //     that.setData({
    //     });
    //   }
    // });
  },
  gotoDetails: function(e){
    var id = e.currentTarget.dataset.id;
    var orderType = e.currentTarget.dataset.ordertype;
    console.log(orderType);
    wx.navigateTo({
      url: '../orderDetails/orderDetails?orderID=' + id + '&orderType=' + orderType,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /* tab */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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