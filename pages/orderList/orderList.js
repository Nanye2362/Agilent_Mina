// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换 
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    tabList: [
      [
        {
          'orderTime': '2018-03-04',
          'orderType': '安装申请',
          'orderSn':'SN899293',
          'orderStatus':'预约中',
          'id':'123',
        },
        {
          'orderTime': '2018-03-04',
          'orderType': '安装申请',
          'orderSn': 'SN899293',
          'orderStatus': '预约中',
          'id': '123',
        },
        {
          'orderTime': '2018-03-04',
          'orderType': '安装申请',
          'orderSn': 'SN899293',
          'orderStatus': '预约中',
          'id': '123',
        },
      ],
      [
        {
          'orderTime': '2018-03-04',
          'orderType': '安装申请',
          'orderSn': 'SN899293',
          'orderStatus': '预约中',
          'id': '123',
        },
        {
          'orderTime': '2018-03-04',
          'orderType': '安装申请',
          'orderSn': 'SN899293',
          'orderStatus': '预约中',
          'id': '123',
        },
        {
          'orderTime': '2018-03-04',
          'orderType': '安装申请',
          'orderSn': 'SN899293',
          'orderStatus': '预约中',
          'id': '123',
        },
      ],
    ],
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