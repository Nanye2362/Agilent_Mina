
// pages/leave_message/leave_message.js
var app;
var common = require("../../utils/common.js");
var util = require('../../utils/util.js');
var isSend = false;
Page({
  data: {
    describeNo: "0",
    photoURL: [],
    uploadBtn: true,
    desc: "",
    sn: ""
  },
  blurfun: function (event) {
    this.setData(JSON.parse('{"' + event.target.dataset.name + '":"' + event.detail.value + '"}'));
  },
  //跳转到自助服务
  gotoSS: function (e) {
    wx.navigateTo({
      url: '../self_service/self_service',
    })
  },
  getSn: function (e) {
    this.setData({
      sn: e.detail.value.toUpperCase()
    })
  },

  submit: function (event) {
    var URLArr = this.data.photoURL;
    var that = this;
    console.log(13434314);
    if (util.checkEmpty(that.data, ['name', 'company', 'sn', 'desc'])) {
      wx.showModal({
        title: '提示',
        content: '请确认信息输入完整',
        showCancel: false,
      })
      return;
    }
    console.log(222);

    if (isSend) {
      return false;
    }
    isSend = true;
    wx.showLoading({
      title: '提交中，请稍候',
      mask: true
    })
    if (URLArr.length>0){
      util.uploadImg(URLArr, function (imgUrlList) {
        that._submit(imgUrlList);
      })
    } else {
      that._submit([]);
    }

  },
  _submit: function (imgUrlList) {
    var that = this;
    util.NetRequest({
      showload:false,
      url: "sr/submit-leavemsg", data: {
        username: that.data.name,
        company: that.data.company,
        serial_no: that.data.sn,
        fault_desc: that.data.desc,
        from: 'wechat',
        img_1: imgUrlList[0],
        img_2: imgUrlList[1],
        img_3: imgUrlList[2],
        img_4: imgUrlList[3]
      }, fail: function (e) {
        console.log(e);
        isSend = false;
      }, success: function (res) {
        isSend=false;
        console.log(res);
        if (res.success) {
          wx.showModal({
            title: '提交成功',
            content: '您的服务申请已提交成功，我们将在下一个工作日优先与您取得联系。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                });
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '提交失败，请稍后再试！',
            showCancel: false
          })
        }
      }
    })
  },
  clickToDelete: function (event) {
    console.log(event);
    var URLArr = this.data.photoURL;
    var index = event.target.dataset.index;
    URLArr.splice(index, 1);
    if (URLArr.length < 4) {
      this.setData({ uploadBtn: true })
    }
    this.setData({ photoURL: URLArr });
  },
  chooseimage: function (event) {
    var _this = this;
    var app=getApp();
    app.globalData.isUploading = true;
    var URLArr = this.data.photoURL;
    console.log(URLArr);
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        app.globalData.isUploading = false;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        URLArr = URLArr.concat(res.tempFilePaths);
        console.log(URLArr);
        if (URLArr.length == 4) {
          _this.setData({ uploadBtn: false })
        }
        if (URLArr.length > 4) {
          wx.showToast({
            title: '图片大于4张，请重新上传',
            icon: 'loading',
            duration: 2000,
            mask: 'true'
          })
          return false;
        }
        _this.setData({
          photoURL: URLArr
        });
        console.log(_this.data.photoURL)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mta统计结束
    var that = this;
    util.getUserInfo(function (user) {
      that.setData({
        name: user.name,
        company: user.company,
        mobile: user.mobile
      })
    });
  },
  desNo: function (e) {
    this.setData({ describeNo: (e.detail.value).length, desc: e.detail.value });
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