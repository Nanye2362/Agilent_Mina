// pages/myhome/myhome.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_img_url: '../../images/no-avatar.png',
    InstrumentCount: 0,
    NewNotificationCount: 0,
  },

  gotoNext: function(event){
    var is_auth = this.data.is_auth;
    var needauth = event.currentTarget.dataset.needauth;
    if (needauth==0 && is_auth==false){
      wx.navigateTo({
        url: '../auth/auth?pageName=myhome'
      })
    } else {
      wx.navigateTo({
        url: event.currentTarget.dataset.url + '?pageName=myhome'
      })
    }
  },

  gotoNextMiniProgram: function(event){
    wx.navigateToMiniProgram({
      appId: config.elearningAppid,
      path: 'pages/welcome/welcome',
      success(res) {
        // 打开成功
      }
    })
  },

  //解绑
  Unbind: function (e) {
    wx.showModal({
      title: '解除绑定',
      content: '请注意，所有的记录都将被删除，您确认要解除绑定吗？',
      success: function (sm) {
        if (sm.confirm) {
          //请求后台接口
          util.NetRequest({
            url: 'api/v1/users/bind',//auth/user-unbind
            method:'DELETE',
            data: {
              wxopenid: wx.getStorageSync('OPENID'),
              ContactGuid: e.currentTarget.dataset.contact_guid
            },
            success: function (res) {
              if (res.status == true) {
                wx.removeStorageSync('MOBILE');
                util.getUserInfoSobot();
                wx.showModal({
                  title: '解绑成功',
                  content: '您已解绑成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../index/index'
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '解绑失败',
                  icon: res.error_msg,
                  duration: 2000
                });
              }
            }
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload.......");
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    util.NetRequest({
      url: 'api/v1/user/service-num',//site-mini/my-count
      data: {},
      method:'GET',
      success: function (res) {
        console.log('service-num',res); //后台获取到的mycount数据
        that.setData({
          ContactGuid: res.data.ContactGuid,
          InstrumentCount: res.data.intrument_num,
          company: res.data.company,
          email: res.data.email,
          head_img_url: res.data.users.head_url,
          is_auth:  res.data.users.isBind == null ? false :  res.data.users.isBind,
          mobile:  res.data.users.mobile,
          name:  res.data.users.name,
          AppointmentCount:  res.data.reservation_num,
          NewNotificationCount:  res.data.NewNotificationCount,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
