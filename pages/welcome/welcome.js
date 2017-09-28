//index.js
var util = require('../../utils/util.js');
// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ready: true,
    welcomeWord: '安捷伦售后服务小程序',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.NetRequest({
      url: 'api/check-lunch',
      data: {
      },
      success: function (res) {
        if (res.success) {
          wx.setStorageSync('wrapper_text', res.text);
          setTimeout(function () {
            wx.switchTab({ url: '../index/index', })
          }, 2000)

        } else {
          that.setData({
            welcomeWord: '服务即将开启，敬请期待'
          })
        }

      },
      fail: function () {
        wx.showModal({
          title: '请求失败',
          content: '请检查您的网络',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotoIndex: function () {
    console.log('enter')
    wx.switchTab({
      url: '../index/index',
    })
  },



})