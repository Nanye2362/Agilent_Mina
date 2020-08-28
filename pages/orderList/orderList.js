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
    tabList: []
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
    that.getCurrentTabReservation(0);
    that.getCurrentTabReservation(1);
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
  getCurrentTabReservation(currentTab) {
    var that = this;
    util.NetRequest({
      url: 'api/v1/reservation/list?type=' + currentTab,
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data) {
          let resList = res.data.list;
          var temList=[];
          resList.forEach(function (item) {
            console.log('resList item:',item);
            if (item.type === 0) {
              item.typeName = '安装申请'
            } else if (item.type === 1) {
              item.typeName = '预防性维护'
            } else if (item.type === 2) {
              item.typeName = '法规认证'
            }
            temList.push(item);
          })
          that.data.tabList[currentTab]=temList;
          that.setData({
            tabList: that.data.tabList
          })
          console.log("tabList:", that.data.tabList);
        }
      }
    });
  },
  gotoDetails: function (e) {
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
    console.log("bindChange:",e);
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    console.log("swichNav:",e);
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