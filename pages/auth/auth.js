// pages/authentication/authentication.js
var util = require('../../utils/util.js');
var clock='';
var nums=60;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    verification_code: '',
    disabled:true,
    disabled1:false,
    code:"获取验证码",
    clock:'',
    nums :60,
    mobileV: false,
    codeV: false, 
    pageName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options,e) {
    console.log(options.pageName);
    var pageName = options.pageName;
    this.setData({pageName: pageName});
  },


  registrationSubmit: function (e) {
    var pageName = this.data.pageName;
    //验证手机号与短信验证码
    console.log(e.detail.value);
    var mobile = e.detail.value.mobile
    var vfcode = e.detail.value.verification_code   
    util.NetRequest({
      url: 'auth/auth?mobile=' + mobile,
      data: {
        'mobile': mobile,
        'vcode': vfcode,       
        disabled:true,
      },
      success: function (res) {
        console.log(res);
        if (res.success == true) {
          wx.setStorageSync('mobile', mobile)
          wx.redirectTo({
            url: '../'+pageName+'/'+pageName +'?mobile='+mobile ,
          })
          
        } else {
          console.log(res.noskip)
          console.log(res.error_msg)
          wx.showModal({
            title: '认证失败',
            content: res.error_msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if (noskip == 1) {
                } else {
                  wx.navigateTo({
                    url: '../fill_info/fill_info?mobile=' + mobile,
                  })
                }
              }
            }
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }, 
   //获取验证码
  getSMSCode: function (e) { 
    console.log('getSMSCode');
    var that = this;
    var mobile = that.data.mobile;
    console.log('mobile'+mobile);

    if (mobile.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'fail',
        duration: 2000
      })
    }else{
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
          console.log(res.data.status);
          if (res.data.status == 1) {
            that.setData({ disabled1: true })
            that.setData({ code: nums + '秒' })
            clock = setInterval(that.doLoop, 1000);
          }
        },
        fail: function (err) {
          console.log(err);
        }
      });
    }
    
    //对接SMS服务器获取短信验证码
    
  },
  doLoop() {
    var that = this;   
    if(nums>0)
    {
      that.setData({ code: nums + '秒' })
      nums--;
    }
    else{
      clearInterval(clock);
      that.setData({ disabled1:false })
      that.setData({ code:'获取验证码' }) 
      nums = 60;
    }
  },

  //判断输入框的值是否为空
  getmobile: function (e) {
    console.log(e.detail.value)
    if(e.detail.value == null ||e.detail.value == ""){
      this.setData({ mobileV: false })      
    } else{
      this.setData({ mobileV: true })
    }
  },
  //获取输入的值
  setmobile: function(e){
    var smobile = e.detail.value
    this.setData({mobile:smobile});
  },
  //获取输入的值
  setcode: function (e) {
    var scode = e.detail.value
    this.setData({ verification_code: scode });
  },
   //判断输入框的值是否为空
  getcode: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == null || e.detail.value == "") {
      this.setData({ codeV: false })     
    } else{
      this.setData({ codeV: true })
    }
  },

})