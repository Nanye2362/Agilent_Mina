// pages/install/install.js
var commondata = require('../../Data/database.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadBtn: true,
    uploadUrlArr: []

  },

  /* *
 *   点击删除图片 
  */
  clickToDelete: function (event) {
    console.log(event);
    var URLArr = this.data.uploadUrlArr;
    var index = event.target.dataset.index;
    URLArr.splice(index, 1);
    if (URLArr.length < 4) {
      this.setData({ uploadBtn: true })
    }
    this.setData({ uploadUrlArr: URLArr });
  },

  /*
  *  点击上传图片
  */
  chooseimage: function (event) {
    var _this = this;

    var URLArr = this.data.uploadUrlArr;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        URLArr = URLArr.concat(res.tempFilePaths);
        //console.log(URLArr);
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
          uploadUrlArr: URLArr
        });
        //console.log(_this.data.uploadUrlArr)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(commondata);
    commondata.fun1();
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