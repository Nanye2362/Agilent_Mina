//index.js

//获取应用实例
var app = getApp()
var routes = require('../../utils/routes');
Page({
  data: {
    imgUrls:
    [{
      url: '/images/slider1.jpg'
    },
    {
      url: '/images/slider2.jpg'
    },
    {
      url: '/images/slider3.jpg'
    }],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    cellHeight: '120px',
    pageItems: [],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },

  srOnclick: function () {
    var user = wx.getStorageSync('user');
    console.log(user);
    if (user) {
      wx.navigateTo({
        url: '../service_request/service_request'
      })
    } else {
      wx.navigateTo({
        url: '../registration/registration'
      })
    }
  }
}) 