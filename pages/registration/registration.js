// pages/authentication/authentication.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: {},
    verification_code: {}
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

  registrationSubmit: function (e) {
    //验证手机号与短信验证码
    console.log(e.detail.value);
    wx.request({
      url: 'https://devopsx.coffeelandcn.cn/agilent/web/auth/register',
      data: {
        'openid': 'oVpgL0YIl_OobwRZsAgrhKQ2FHjA',
        'mobile': e.detail.value.mobile,
        'verification_code': e.detail.value.verification_code
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == true) {
          //短信验证码正确，需要在AWS中关联wechat&SAP信息
          wx.redirectTo({
            url: '../service_request/service_request'
          })
        } else {
          //短信验证码错误
          wx.showToast({
            title: '验证码错误',
            icon: 'fail',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },

  getSMSCode: function () {
    var that = this;
    console.log(that.data.mobile);
    //对接SMS服务器获取短信验证码
    wx.request({
      url: 'https://devopsx.coffeelandcn.cn/agilent/web/auth/get-smscode',
      data: {
        'countrycode': '',
        'mobile': that.data.mobile
      },
      success: function (res) {
        console.log(res.data.status);
        if (res.data.status == 1) {
          //验证码发送成功
          wx.showToast({
            title: '验证码发送成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },

  getmobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  getcode: function (e) {
    this.setData({
      verification_code: e.detail.value
    })
  }
})