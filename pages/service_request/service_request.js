// pages/service_request/service_request.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  srSubmit: function (e) {
    console.log(e.detail.value);
    wx.request({
      url: 'https://devopsx.coffeelandcn.cn/agilent/web/sr/confirm',
      data: {
        'openid': 'oVpgL0YIl_OobwRZsAgrhKQ2FHjA',
        'mobile': '13482641158',
        'serial_number': e.detail.value.serial_number
      },
      success: function (res) {
        console.log(res.data.success);
        if (res.data.success === true) {
          wx.navigateTo({
            url: '../service_center/service_center',
          })
        } else {
          console.log('error');
        }

      },
      fail: function (err) {
        console.log(err);
      }
    });
  }
})