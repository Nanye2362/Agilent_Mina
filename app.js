//app.js
var util = require('/utils/util.js');
//var aldstat = require("./utils/ald-stat.js");
var mta = require('/utils/mta_analysis.js');
var miniApp_env = "prod";// prod或uat
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
      var res = wx.getSystemInfoSync()
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
    this.wxlogin();

  },
  onShow: function (res) {
    var nowDate = new Date();
    var lastDate=wx.getStorageSync("sessionDate");
    var that = this;
    console.log(nowDate - lastDate);
    if (lastDate && nowDate - lastDate>=60*60*1000){//毫秒  1小时   
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
  globalData: {
    miniApp_env: miniApp_env,// prod或uat 
    userInfo: null,
    requestList: [],
    isLoading: false,
    isLogin: false,
    isWelcomeAuth: false,
    needCheck: false,
    isSetOption: false,
    isFirstLunch: true,
    isUploading: false,
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
              console.log(r);
              if (r.success == true) {
                console.log(that);
                that.globalData.needCheck = false;
                wx.setStorageSync('MOBILE', r.mobile);
                wx.setStorageSync('OPENID', r.openid);
                that.globalData.isLogin = true;
                //that.gotoIndex();
              } else {
                that.globalData.needCheck = true;
                if (wx.canIUse('web-view')){
                  wx.navigateTo({
                    url: '../user_guidelines/user_guidelines' 
                  });
                }else{
                  that.alertInfo();
                }  
                console.log(r.error_msg);
              }
            },
            complete: function () {
              that.globalData.isLoading = false;
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  alertInfo: function(){
    var that=this;
    wx.showModal({
      title: '温馨提示',
      content: '为了更好的体验，请更新微信到最新版本后使用。',
      showCancel: false,
      success: function (res) {
        if (!that.globalData.isLogin){
          that.alertInfo();
        }
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