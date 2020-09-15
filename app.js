//app.js
/*const monitor = require('./agilent/tingyun-mp-agent.js');
monitor.config({
  beacon: 'https://beacon-mp.tingyun.com',
  key: 'ZyzpwHhZRY4',
  id: 'kt3ZSav_Wzc',
  sampleRate: 1
});*/
import regeneratorRuntime from 'agilent/regenerator-runtime/runtime'

var miniAppupdate=require("/utils/miniAppupdate.js");
var loginApi = require('/utils/login.js');
//var aldstat = require("./utils/ald-stat.js");
var mta = require('/utils/mta_analysis.js');
var miniApp_env = "prod";// prod或uat
var userMobile={};
var util = require('/utils/util.js');

console.log(userMobile);
App({
  onLaunch: function (e) {

    miniAppupdate.checkUpdate();//检测小程序版本

    mta.App.init({
        "appID": "500539156",
        "eventID": "500539161",
    });

    this.mta = mta;

    this.globalData.isLoading = true;
    this.globalData.isFollow = true;
    try {
      var res = wx.getSystemInfoSync();
      this.globalData.userMobile.brand = res.brand;
      this.globalData.userMobile.model = res.model;
      this.globalData.userMobile.language = res.language;
      this.globalData.userMobile.version = res.version;
      this.globalData.userMobile.platform = res.platform;
      this.globalData.userMobile.SDKVersion = res.SDKVersion;
      this.globalData.userMobile.system = res.system;
    } catch (e) {
      // Do something when catch error
    }

    //console.log(userMobile);
    loginApi.login(this);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.sysInfo = {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          dateWidth: parseInt((res.windowWidth - 30) / 7),
        }
      }
    });
},

  async onShow(res) {
    this.globalData.appShow = true;

    //如果已在后台启动并且是客服链接过来的，就打开指定页面
    if (!this.globalData.isFirstLunch && (res.scene == 1081 || res.scene == 1082) && res.path.length != 0) {
      wx.redirectTo({
        url: res.path,
      })
    }

    var nowDate = new Date();
    var lastDate=wx.getStorageSync("sessionDate");
    var that = this;

    if (that.globalData.needCheck){
      wx.redirectTo({
        url: '/pages/initiate/initiate'
      });
    }else if (lastDate && nowDate - lastDate>=60*60*1000){//毫秒  1小时
      if (!that.globalData.isSetOption && !that.globalData.isFirstLunch) {
        wx.redirectTo({
          url: '/pages/initiate/initiate'
        });
      }
    }
    // if(res.path != 'pages/initiate/initiate'){ //不是正常页进入
    //   that.wxlogin();
    // }
    await util.getUserInfoSobot();

    that.globalData.isFirstLunch = false;
    if(that.globalData.syncFlag == false){
      await that.syncUserInfo();
    }
  },
  onHide:function () {
    this.globalData.appShow=false;
    var nowDate = new Date();
    wx.setStorageSync("sessionDate", nowDate);
  },
  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    nickName:'',
    avatarUrl: '',
    sobotData:[],
    miniApp_env: miniApp_env,// prod或uat
    userInfo: null,
    requestList: [],
    isLoading: false,
    isLogin: false,
    isWelcomeAuth: false,
    needCheck: false,    //是否需要检测
    isSetOption: false, //是否正在配置
    isFirstLunch: true, //是否第一次打开
    isUploading: false, //是否正在上传
    appShow:true,
    loginText:'',
    timer: '',
    tabbar: {
      "color": "#a9b7b7",
      "selectedColor": "#0085d5",
      "backgroundColor": "#f7f7f7",
      "borderStyle": "#aaa",
      "list": [
        {
          "pagePath": "../index/index",
          "text": "首页",
          "iconPath": "/images/home.png",
          "selectedIconPath": "images/home_c.png"
        },
        {
          "pagePath": "pages/contact_us/contact_us",
          "text": "联系安捷伦",
          "iconPath": "/images/contact.png",
          "selectedIconPath": "/images/contact_c.png"
        },
        {
          "pagePath": "/pages/myhome/myhome",
          "text": "我的",
          "iconPath": "/images/my.png",
          "selectedIconPath": "/images/my_c.png"
        }
      ],
      position: "bottom"
    },
    syncFlag:false,
    //token: wx.getStorageSync('token')
  },
  /*
  gotoIndex: function () {
    console.log('enter');
    if (this.globalData.isWelcomeAuth && this.globalData.isLogin) {
      this.globalData.isLoading = false;
      wx.switchTab({
        url: '../index/index',
      })
    }
  },*/
//  wxlogin() {
//     var that = this;

//     that.globalData.syncFlag = true;
//     wx.login({
//       success: function (res) {
//         console.log(res);
//         if (res.code) {
//           //发起网络请求
//           util.NetRequest({
//             url: 'api/v1/wechat/login',
//             data: {
//               code: res.code,
//               userMobile: JSON.stringify(userMobile)
//             },
//             showload: false,
//             success: function (r) {
//               that.globalData.isLoading = false;
//               console.log(r);
//               if (r.success == true) {
//                 that.globalData.needCheck = false;
//                 wx.setStorageSync('MOBILE', r.data.mobile);
//                 wx.setStorageSync('OPENID', r.data.openid);
//                 that.globalData.isLogin = true;
//                 //that.gotoIndex();
//                 that.syncUserInfo();
//                 that.globalData.syncFlag = false;
//                 util.NetRequest({
//                   url: 'api/v1/wechat/get-global-group',//wechat-mini/get-global-group
//                   method:"GET",
//                   success: function (res1) {
//                     that.globalData.sobotData = res1.data;

//                   }
//                 });
//               } else if (typeof (r.error_msg) !="undefined"){
//                 that.globalData.needCheck = true;
//               }
//             },
//             fail:function(){
//               that.wxlogin();
//             }
//           })
//         } else {
//           console.log('获取用户登录态失败！' + res.errMsg)
//         }
//       }
//     });
//   },


  syncUserInfo:function(){
    var _this = this;
    return;
    util.NetRequest({
      url: 'site-mini/search-user-by-union-id',
      data:{},
      showload: false,
      success:function (r1) {
      },
      fail:function(){
      }
    });
  },

  alertInfo: function(text){
    var that=this;
    if (typeof (text) !="undefined"){
      that.globalData.loginText = text;
    }
    wx.hideLoading();
    wx.showModal({
      title: '温馨提示',
      content: that.globalData.loginText,
      showCancel: false,
      success: function (res) {

      }
    })
  }

  /*
  showTips: function () {
    var displayTips = this.data.displayTips
    console.log('showtips')
    this.setData({
      displayTips: !displayTips
    })
  },*/
})
