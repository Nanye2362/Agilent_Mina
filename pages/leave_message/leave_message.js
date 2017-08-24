
// pages/leave_message/leave_message.js
var app;
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    describeNo: "0",
    photoURL: [],
    uploadBtn: true
  },
  clickToDelete: function(event){
    console.log(event);
    var URLArr = this.data.photoURL;
    var index = event.target.dataset.index;
    URLArr.splice(index,1);
    if (URLArr.length < 4){
      this.setData({ uploadBtn: true})
    }
    this.setData({ photoURL: URLArr});

  },
  chooseimage: function (event) {
    var _this = this;
   
    var URLArr = this.data.photoURL;
    console.log(URLArr);
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(URLArr);
        URLArr =  URLArr.concat(res.tempFilePaths);
        console.log(URLArr);
        if (URLArr.length == 4){
          _this.setData({ uploadBtn: false })
        }
       if (URLArr.length > 4){
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
    app = getApp();
    //this.setData({ version: app.globalData.appName });
    //common.myfunc();
    //common.uploadimg();
  },
  desNo: function(e){
    this.setData({describeNo:(e.detail.value).length});
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