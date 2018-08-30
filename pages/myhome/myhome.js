// pages/myhome/myhome.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_img_url: '../../images / no - avatar.png',
    InstrumentCount: 0,
  },

  gotoNext: function(event){
    console.log(event.currentTarget.dataset.url + '?pageName=myhome');
    wx.navigateTo({
      url: event.currentTarget.dataset.url+'?pageName=myhome'
    })
  },

  Unbind: function (e) {
    wx.showModal({
      title: '解除绑定',
      content: '请注意，所有的记录都将被删除，您确认要解除绑定吗？',
      success: function (sm) {
        if (sm.confirm) {
          console.log('点击确认')
          //请求后台接口
          util.NetRequest({
            url: 'auth/user-unbind',
            data: {
              wxopenid: wx.getStorageSync('OPENID'),
              ContactGuid: e.currentTarget.dataset.contact_guid
            },
            success: function (res) {
              console.log(res);
              if (res.success == true) {
                wx.removeStorageSync('MOBILE');
                wx.showModal({
                  title: '解绑成功',
                  content: '您已解绑成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../index/index'
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '解绑失败',
                  icon: res.error_msg,
                  duration: 2000
                });
              }
            }
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload.......");
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束


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
    var that = this;
    util.NetRequest({
      url: 'site-mini/my-count',
      data: {},
      success: function (res) {
        console.log(res); //后台获取到的mycount数据
        that.setData({
          ContactGuid: res.ContactGuid,
          InstrumentCount: res.InstrumentCount,
          company: res.company,
          email: res.email,
          head_img_url: res.head_img_url,
          is_auth: res.is_auth,
          mobile: res.mobile,
          name: res.name,
          AppointmentCount: res.AppointmentCount,
        });
      }
    });
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