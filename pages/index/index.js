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
    var that = this
    console.log(app);
    //调用应用实例的方法获取全局数据 
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      var pageItems = [];
      var row = [];
      var len = routes.PageItems.length;//重组PageItems 
      len = Math.floor(len);
      for (var i = 0; i < len; i++) {
        if ((i + 1) % 2 == 0) {
          row.push(routes.PageItems[i]);
          pageItems.push(row);
          row = [];
          continue;
        }
        else {
          row.push(routes.PageItems[i]);
        }
      }
      console.log(pageItems)
      wx.getSystemInfo({
        success: function (res) {
          var windowWidth = res.windowWidth;
          that.setData({
            cellHeight: (windowWidth / 2.5) + 'px'
          })
        },
        complete: function () {
          that.setData({
            pageItems: pageItems
          })
        }
      })
    })
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