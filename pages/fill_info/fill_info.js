var app = getApp()
var util = require('../../utils/util.js');
Page({
    data: {
      mobile: '',
      nameV: false,
      companyV: false,
      snV: false,
      name:'',
      company:'',
      other:'',
      sn:'',
    },

    onLoad: function (options) {
      var meiqia = wx.getStorageSync('meiqia')
      this.setData({
        NONTECH: meiqia.NONTECH
      })
      var mobile = options.mobile
      this.setData({
        'mobile': mobile,
      })
    },
    //submit form
    submitConfirm: function(e){
      console.log(e.detail.value)
      //获取手机
      var mobile = this.data.mobile
      console.log('mobile==========='+mobile)
      var name = this.data.name
      console.log('name======'+name)
      var company = this.data.company
      console.log('company======' + company)
      var sn = this.data.sn
      console.log('sn======' + sn)
      var other = this.data.other
      console.log('other======' + other)
      var isupload = false;
      if (isupload) {
        return false;
      }
      isupload = true;
      util.NetRequest({
        url: 'auth/info-setup',
        data: {
          'username': name,
          'mobile': mobile,
          'company': company,
          'serial_no': sn,
          'remark':other,
        },
        success: function (res) {
          console.log(res);
          if (res.success == true) {
            wx.showModal({
              title: '提交成功',
              content: '您已提交，客服即将为你处理，请稍后……',
              showCancel: false,
              success: function () {
                wx.switchTab({
                    url: '../index/index'
                  })
              }
            })
          } else {
            wx.showModal({
              title: '重复提交',
              content: '您已提交信息，客服正在为您建档',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              }
            })
          }
        },
        fail: function (err) {
          wx.showModal({
            title: '提交失败',
            content: '您已提交过信息，客服正在为您建档',
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        }
      })
    },



    //判断输入框的值是否为空
    getname: function (e) {
      //console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ nameV: false })
      } else {
        this.setData({ 
          nameV: true,
          name: e.detail.value
         })
      }
    },
    getcompany: function (e) {
      //console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ companyV: false })
      } else {
        this.setData({ 
          companyV: true,
          company: e.detail.value
         })
      }
    },
    getsn: function (e) {
      console.log(e.detail.value)
      var sn = e.detail.value.toUpperCase()
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ snV: false })
      } else {
        this.setData({ 
          snV: true,
          sn: sn
         })
      }
    },   
    getother: function (e) {
      this.setData({
        other: e.detail.value
      })
    },

}) 