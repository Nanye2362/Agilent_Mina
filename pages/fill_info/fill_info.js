var app = getApp()
Page({
    data: {
      mobile: 13800009999,
    },

    onLoad: function () {

    },



    //判断输入框的值是否为空
    getname: function (e) {
      console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ mobileV: false })
      } else {
        this.setData({ mobileV: true })
      }
    },
    //判断输入框的值是否为空
    getcompany: function (e) {
      console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ codeV: false })
      } else {
        this.setData({ codeV: true })
      }
    },
    //判断输入框的值是否为空
    getsn: function (e) {
      console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ codeV: false })
      } else {
        this.setData({ codeV: true })
      }
    },

}) 