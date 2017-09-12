var app = getApp()
var util = require('../../utils/util.js');
Page({
    data: {
      mobile: 13800009999,
      nameV: false,
      companyV: false,
      snV: false,
    },

    onLoad: function () {

    },
    //submit form
    submitConfirm: function(e){
      console.log(e.detail.value)
      //获取手机
      var mobile = this.data.mobile
      console.log('mobile==========='+mobile)
      var name = e.detail.value.name
      var company = e.detail.value.company
      var sn = e.detail.value.sn
      var other = e.detail.value.other
      var isupload = false;
      if (isupload) {
        return false;
      }
      isupload = true;
      util.NetRequest({
        url: 'auth/info-setup',
        data: {
          'name': name,
          'company': company,
          'sn': sn,
          'otherInfo':other,
        },
        success: function (res) {
          console.log(res);
          if (res.success == true) {
            wx.showModal({
              title: '提交成功',
              content: '您已提交，客服即将为你处理，请稍后……',
              success: function () {
                  wx.redirectTo({
                    url: 'site/index' + '?mobile=' + mobile+'&username=' + name + '&company=' + company + '&serial_no=' + sn
                  })
              }
            })
          } else {
            wx.showModal({
              title: '提交失败',
              content: '您已提交信息，客服正在为您建档',
              success: function (res) {
                if (res.confirm) {
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
        this.setData({ nameV: true })
      }
    },
    getcompany: function (e) {
      //console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ companyV: false })
      } else {
        this.setData({ companyV: true })
      }
    },
    getsn: function (e) {
      //console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ snV: false })
      } else {
        this.setData({ snV: true })
      }
    },   
    //获取输入的值
    setname: function (e) {
      var sname = e.detail.value
      this.setData({ 'name': sname });
    },
    setcompany: function (e) {
      var scompany = e.detail.value
      this.setData({ 'company': scompany });
    },
    setsn: function (e) {
      var ssn = e.detail.value
      this.setData({ 'sn': ssn });
    },
    setother: function (e) {
      var sother = e.detail.value
      this.setData({ 'other': sother });
    },

}) 