//index.js
var util = require('../../utils/util.js');
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
  onLoad: function (option) {
    console.log('onload' + option);
    var that = this
    console.log(app);
    //调用应用实例的方法获取全局数据 
    // app.getUserInfo(function (userInfo) {
    //   that.setData({
    //     userInfo: userInfo
    //   })
    //   var pageItems = [];
    //   var row = [];
    //   var len = routes.PageItems.length;//重组PageItems 
    //   len = Math.floor(len);
    //   for (var i = 0; i < len; i++) {
    //     if ((i + 1) % 2 == 0) {
    //       row.push(routes.PageItems[i]);
    //       pageItems.push(row);
    //       row = [];
    //       continue;
    //     }
    //     else {
    //       row.push(routes.PageItems[i]);
    //     }
    //   }
    //   console.log(pageItems)
    //   wx.getSystemInfo({
    //     success: function (res) {
    //       var windowWidth = res.windowWidth;
    //       that.setData({
    //         cellHeight: (windowWidth / 2.5) + 'px'
    //       })
    //     },
    //     complete: function () {
    //       that.setData({
    //         pageItems: pageItems
    //       })
    //     }
    //   })
    // })
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
  },

/*
**  我要报修跳转
*/
  clickToRepair: function (event) {
    util.IsCertificate(function(){
        //绑定的话，检测是否为工作时间
      util.checkWorktime(function(){
        //绑定 且 是工作时间
        wx.navigateTo({
          url: '../serial_number/serial_number',
        });
      }, function(){
        //绑定 但 不是工作时间
        wx.navigateTo({
          url: '../leave_message/leave_message',
        })
      }
      ) 
      //未绑定，则跳转认证页面
    }, function(){
      wx.navigateTo({
        url: '../auth/auth?pageName=index',

      })
    });
    
      //检测工作时间
    // function checkWorktime() {
    //   console.log(2)
    //   util.NetRequest({
    //     url: 'util/get-worktime',
    //     success: function (res) {
    //       console.log(res)
    //       if (res.success == true) {
    //         wx.navigateTo({
    //           url: '../serial_number/serial_number',
    //         })
    //       } else {
    //         wx.navigateTo({
    //           url: '../leave_message/leave_message',
    //         })
    //       }
    //     }
    //   });
    // }
  },
/*
** 安装申请、服务历史 点击跳转
*/
  nevigateToNext: function(e){
    console.log(e)
    var url = e.currentTarget.dataset.url;
      util.IsCertificate(function () {
        //绑定的话,跳转相应页面
        wx.navigateTo({
          url: url,
        })
      
        //未绑定，则跳转认证页面
      }, function () {
        wx.navigateTo({
          url: '../auth/auth?pageName=index',

        })
      });

  },

  /*
**  自助服务点击弹出框
*/
  clickToHint:function(){
    wx.showToast({
      title: '自助服务暂未开通',
      image: '../../images/hint.png',
      duration: 2000,
    })
  }
  
}) 