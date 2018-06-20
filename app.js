//app.js
var util = require('/utils/util.js');

//var aldstat = require("./utils/ald-stat.js");
var mta = require('/utils/mta_analysis.js');
var miniApp_env = "prod";// prod或uat
var userMobile={};


console.log(userMobile);
App({
  onLaunch: function () {
      mta.App.init({
        "appID": "500539156",
        "eventID": "500539161",
      });
   
    this.mta = mta;
    
    this.globalData.isLoading = true;
    try {
      var res = wx.getSystemInfoSync();
      userMobile.brand = res.brand;
      userMobile.model = res.model;
      userMobile.language = res.language;
      userMobile.version = res.version;
      userMobile.platform = res.platform;
      userMobile.SDKVersion = res.SDKVersion;
      userMobile.system = res.system;
    } catch (e) {
      // Do something when catch error
    }
    console.log(userMobile);
    this.wxlogin();
    
  },
  onShow: function (res) {
    var nowDate = new Date();
    var lastDate=wx.getStorageSync("sessionDate");
    var that = this;
    
    if (that.globalData.needCheck){
      that.wxlogin();
    }else if (lastDate && nowDate - lastDate>=60*60*1000){//毫秒  1小时   
      if (!that.globalData.isSetOption && !that.globalData.isFirstLunch) {
        that.wxlogin();
      }
    }
    that.globalData.isFirstLunch = false;
  },
  onHide:function () {
    
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
    loginText:'',
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
    }  
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
  wxlogin: function () {
    var that = this;

    if (!that.globalData.isUploading){
       wx.showLoading({
        title: '加载中，请稍候',
        mask: true
      })
    }
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          util.NetRequest({
            url: 'wechat-mini/wx-login',
            data: {
              code: res.code,
              userMobile: JSON.stringify(userMobile)
            },
            showload: false,
            success: function (r) {
              that.globalData.isLoading = false;
              console.log(r);
              if (r.success == true) {
                console.log(that);
                that.globalData.needCheck = false;
                wx.setStorageSync('MOBILE', r.mobile);
                wx.setStorageSync('OPENID', r.openid);
                that.globalData.isLogin = true;
                //that.gotoIndex();
              } else if (typeof (r.error_msg) !="undefined"){
                that.globalData.needCheck = true;
                that.alertInfo(r.error_msg);
              } else {
                that.globalData.needCheck = true;
                if (wx.canIUse('web-view')){
                  wx.navigateTo({
                    url: '../user_guidelines/user_guidelines' 
                  });
                }else{
                  that.alertInfo('为了更好的体验，请更新微信到最新版本后使用。');
                }  
                console.log(r.error_msg);
              }
            },
            fail:function(){
              that.wxlogin();
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
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