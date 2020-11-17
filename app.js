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

    //先赋值原始数据，防止拉取智齿组接口超时导致咨询时丢失参数
    var sobotData = '[{"id":1,"desc":"扫描网络版实验室的二维码进入","g1":"b3ad2d6777644f0d87c0d6d533fd39ac","g1_type":1,"g2":"8a5d93e071fe4f95925bb4ea68348cfa","g2_type":1,"g3":"1a03c896db514e4fb37df954c1e963f4","g3_type":1,"g4":"b3ad2d6777644f0d87c0d6d533fd39ac","g4_type":1},{"id":2,"desc":"序列号匹配成功，但不在上面list中的产品","g1":"1a03c896db514e4fb37df954c1e963f4","g1_type":1,"g2":"48ef61dbd7a24a44832c73cf59a6f0be","g2_type":1,"g3":"4494f0f4ef244003a13c8540bfc9c9da","g3_type":1,"g4":"59e794b29731492cae1aa1a5520a3990","g4_type":1},{"id":3,"desc":"序列号输入后与SAP系统匹配失败","g1":"234244cd0b334ed59497203a5cf2e84f","g1_type":1,"g2":"f287e31181c44789b8c634d30f43667a","g2_type":1,"g3":"66ba470959514d60b88ea2b9049c2274","g3_type":1,"g4":"9734a9958abf40288f312fd2930deb53","g4_type":1},{"id":4,"desc":"报价单页面发起咨询","g1":"f287e31181c44789b8c634d30f43667a","g1_type":1,"g2":"234244cd0b334ed59497203a5cf2e84f","g2_type":1,"g3":"66ba470959514d60b88ea2b9049c2274","g3_type":1,"g4":"9734a9958abf40288f312fd2930deb53","g4_type":1},{"id":5,"desc":"服务预约里三个入口","g1":"66ba470959514d60b88ea2b9049c2274","g1_type":1,"g2":"9734a9958abf40288f312fd2930deb53","g2_type":1,"g3":"234244cd0b334ed59497203a5cf2e84f","g3_type":1,"g4":"f287e31181c44789b8c634d30f43667a","g4_type":1},{"id":6,"desc":"服务历史发起会话","g1":"1a03c896db514e4fb37df954c1e963f4","g1_type":1},{"id":7,"desc":"电话工单补充图片","g1":"1a03c896db514e4fb37df954c1e963f4","g1_type":1},{"id":8,"desc":"在线咨询-消耗品咨询购买","g1":"e6f66d01e157449bb1c1fe0b53f17274","g1_type":1},{"id":9,"desc":"在线咨询-色谱柱\\/前处理","g1":"6070136ad3e348b2977cbabb1c672f7b","g1_type":1},{"id":10,"desc":"在线咨询-安捷伦大学培训","g1":"00c6449e74034e52aa3e7d83d55f355c","g1_type":1},{"id":11,"desc":"在线咨询-售后服务合同\\/实验室法规认证","g1":"a40b3a0aa8b3432f9b559373bc25756a","g1_type":1},{"id":12,"desc":"在线咨询-实验室仪器采购","g1":"30284d7b5b3c4c908cd503f0f04a35d6","g1_type":1},{"id":13,"desc":"在线咨询-送修及翻新服务","g1":"9ee68eda80c04ca393309ce489c2b385","g1_type":1,"g2":"1a03c896db514e4fb37df954c1e963f4","g2_type":1},{"id":14,"desc":"超值服务-融资购买","g1":"30284d7b5b3c4c908cd503f0f04a35d6","g1_type":1},{"id":15,"desc":"超值服务-送修及翻新","g1":"9ee68eda80c04ca393309ce489c2b385","g1_type":1,"g2":"1a03c896db514e4fb37df954c1e963f4","g2_type":1},{"id":16,"desc":"超值服务-智能实验室","g1":"a40b3a0aa8b3432f9b559373bc25756a","g1_type":1},{"id":17,"desc":"超值服务-消耗品促销","g1":"e6f66d01e157449bb1c1fe0b53f17274","g1_type":1},{"id":18,"desc":"超值服务-标准服务","g1":"6070136ad3e348b2977cbabb1c672f7b","g1_type":1},{"id":19,"desc":"超值服务-安捷伦大学","g1":"00c6449e74034e52aa3e7d83d55f355c","g1_type":1},{"id":41,"desc":"超值服务-仪器租赁","g1":"a40b3a0aa8b3432f9b559373bc25756a","g1_type":1}]';
    this.globalData.sobotData = JSON.parse(sobotData);

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
    wx.onAppRoute((route) => {
      console.log('onAppRoute:', route);
      console.log('that.globalData.needCheck:', that.globalData.needCheck);
      if (route.openType != 'switchTab'&& route.path != 'pages/initiate/initiate' && route.path != 'pages/login/login' && route.path != 'pages/auth_login/auth_login'&&route.path!='pages/privacy-policy/privacy-policy'&&route.path!='pages/jump_page/jump_page') {
        if (that.globalData.needCheck) {
          console.log('reLaunch:', route.path);
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
      return false;
    })
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
