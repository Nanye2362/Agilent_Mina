// pages/authentication/authentication.js
var util = require('../../utils/util.js');
//var mechat = require('../mechat_list/mechat_list.js');
var clock = '';
var nums = 60;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatarUrl: '',
    transferAction: '',
    mobile: '',
    verification_code: '',
    disabled: true,
    disabled1: false,
    code: "获取验证码",
    clock: '',
    nums: 60,
    mobileV: false,
    codeV: false,
    pageName: '',
    shLoading: false,
    shLoading_title: "",
    shLoading_body: "",
    skipFlag: 0,
    alertWithImgData:{
      shLoading_foreign:false
    }
  },
  alertClose:function(){
    this.setData({ alertWithImgData:{
      shLoading_foreign:false,
    }})
  },
  skipHtml5Page:function(){
    wx.setStorage({
      key: "openHtmlUrl",
      data: "https://www.agilent.com/store/",
      success: function () {
        wx.navigateTo({
          url: '../html/openHtml',
        });
      }
    })
  },
  skipFillInfo: function () {
      this.setData({
        shLoading: false,
        shLoading_title: "",
        shLoading_body: ""
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options, e) {
    //腾讯mat统计开始
    var app = getApp();

    this.setData({
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl
    });
    app.mta.Page.init();
    //腾讯mat统计结束
    console.log(options.pageName);
    var pageName = options.pageName;
    if (typeof (pageName) == "undefined") {
      pageName = "index";
    }
    var pagelabel="";
    if (typeof (options.pagelabel) !='undefined'){
      pagelabel = options.pagelabel;
    }
    this.setData({
      pageName: pageName,
      pagelabel: pagelabel,
    });
  },



  registrationSubmit: function (e) {
    var pageName = this.data.pageName;
    console.log(pageName)
    //验证手机号与短信验证码
    console.log(e.detail.value);
    var mobile = e.detail.value.mobile
    var vfcode = e.detail.value.verification_code
    var that = this;
    util.NetRequest({
      url: 'auth/auth?mobile=' + mobile,
      data: {
        'mobile': mobile,
        'verification_code': vfcode,
        disabled: true,
      },
      success: function (res) {
        if (res.success == true) {
          util.getUserInfoSobot();

          wx.setStorageSync('mobile', mobile)
          if (pageName == 'myhome' || pageName == 'index') {
            wx.setStorageSync("MOBILE", mobile);
            wx.switchTab({
              url: '../' + pageName + '/' + pageName + '?mobile=' + mobile,
            })
          } else if (pageName == "mechat_list") {
            var allPages = getCurrentPages();
            allPages[allPages.length - 2].setData({
              shLoading: true
            });
            if (that.data.pagelabel == 'salesBA_CA' || that.data.pagelabel == 'salesBA_CB'){
              allPages[allPages.length - 2].getCusInfo()
            }
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: '../' + pageName + '/' + pageName + '?mobile=' + mobile,
            })
          }

        } else {
          var err_msg = res.error_msg;

          if (err_msg =="foreigner"){
            that.showForeign();
            return;
          }
          if(res.noskip==0){
            var args = "";
            if (that.data.pagelabel.length > 0) {
              args = "&pagelabel=" + that.data.pagelabel;
            }
            wx.navigateTo({
              url: '../fill_info/fill_info?mobile=' + that.data.mobile + args,
            })
          } else if (res.noskip == 1)  {
            that.errCon(err_msg);
            that.setData({
              shLoading: true,
              shLoading_title: '认证失败',
              shLoading_body: err_msg,
              skipFlag: res.noskip
            })
          }
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  errCon: function(err_msg){
    var that = this;
    switch (err_msg) {
      case 'UB001':
        err_msg = '身份认证通过';
        break;
      case 'UB002':
        err_msg = '身份认证通过，您的联系信息关联多家单位，我们将根据您第一次报修的仪器序列号为您关联单位名称';
        break;
      case 'UB003':
        err_msg = '身份认证失败，您的手机号在系统中关联了多个联系人，请点击下方发起会话确认';
        break;
      case 'UB004':
        err_msg = '您已经通过身份认证';
        break;
      case 'UB005':
        err_msg = '您的手机在系统中未关联任何联系人，请提供相关的信息，我们尽快为您建档';
        break;
      case 'UB006':
        err_msg = 'UB006';
        break;
    }
  },
  showForeign(){
    this.setData({
      alertWithImgData: {
        shLoading_foreign: true,
      }
    })
  },
  //获取验证码
  getSMSCode: function (e) {
    console.log('getSMSCode');
    var that = this;
    var mobile = that.data.mobile;
    console.log('mobile' + mobile);
    if (mobile.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'fail',
        duration: 2000
      })
    } else {
      that.setData({ disabled1: true })
      that.setData({ code: nums + '秒' })
      clock = setInterval(that.doLoop, 1000);
      console.log(that.data.mobile);
      util.NetRequest({
        url: 'auth/get-smscode',
        data: {
          'mobile': mobile
        },
        success: function (res) {
          console.log(res);
          if (res.status == 1) {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '发送失败',
              icon: 'fail',
              duration: 2000
            })
          }
        },
        fail: function (err) {
          wx.hideLoading();
          wx.showModal({
            title: '请求失败',
            content: '请检查您的网络',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
          console.log(err);
        }
      });
    }

    //对接SMS服务器获取短信验证码

  },
  doLoop() {
    var that = this;
    if (nums > 0) {
      that.setData({ code: nums + '秒' })
      nums--;
    }
    else {
      clearInterval(clock);
      that.setData({ disabled1: false })
      that.setData({ code: '获取验证码' })
      nums = 60;
    }
  },

  //判断输入框的值是否为空
  getmobile: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == null || e.detail.value == "") {
      this.setData({ mobileV: false })
    } else {
      this.setData({ mobileV: true })
      var smobile = e.detail.value
      this.setData({ mobile: smobile });
    }
  },

  //获取输入的值
  /*
  setmobile: function(e){
    var smobile = e.detail.value
    this.setData({mobile:smobile});
  },
  //获取输入的值
  setcode: function (e) {
    var scode = e.detail.value
    this.setData({ verification_code: scode });
  },*/
  //判断输入框的值是否为空
  getcode: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == null || e.detail.value == "") {
      this.setData({ codeV: false })
    } else {
      this.setData({ codeV: true })
      var scode = e.detail.value
      this.setData({ verification_code: scode });
    }
  },

  //检测工作时间
  isWorkTime: function () {
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'NONTECH' });
  },


})
