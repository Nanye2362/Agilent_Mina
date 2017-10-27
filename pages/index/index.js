//index.js
var util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
var routes = require('../../utils/routes');
Page({
  data: {
    text: '',
    marqueePace: 1,//滚动速度
    marqueeDistance: 200,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval2: 20, // 时间间隔
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
    indicatorActiveColor: '#0085d5',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    var that = this;
    var text='';
    
    util.NetRequest({
      url: 'api/check-lunch',
      data: {
      },
      success: function (res) {
        if (res.success) {
          wx.setStorageSync('wrapper_text', res.text);
          that.setData({
            text: res.text
          })
          //wx.hideLoading();
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '服务器维护中，请稍后尝试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          //wx.hideLoading();
        }
      },
      fail: function (res) {
        console.log(res);
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
  /*
  onShow: function () {
      // 页面显示
    var vm = this;
    var length = vm.data.text.length * vm.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
    vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
    vm.run2();// 第一个字消失后立即从右边出现
  },
  run1: function () {
    var vm = this;
    var interval2 = setInterval(function () {
      if (-vm.data.marqueeDistance < vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval2);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run1();
      }
    }, vm.data.interval2);
  },
  run2: function () {
    var vm = this;
    var interval2 = setInterval(function () {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval2);
          vm.run2();
        } else {
          clearInterval(interval2);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval2);
  },*/

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
        //已绑定
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
    }, 
    //未绑定
    function(){
      util.checkWorktime(function(){
        //未绑定， 且不是工作时间
        wx.navigateTo({
          url: '../auth/auth?pageName=serial_number',
        })       
      },function(){
        //未绑定，是工作时间
        wx.navigateTo({
          url: '../auth/auth?pageName=leave_message',
        })
      })     
    });
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
          url: '../auth/auth?pageName=self_service',

        })
      });

  },
 
  /*
**  自助服务点击弹出框
*/
  clickToHint:function(){
    wx.showToast({
      title: '敬请期待',
      image: '../../images/hint.png',
      duration: 2000,
    })
  },

  clearStorage: function(){
    wx.clearStorageSync();
  }
  
}) 