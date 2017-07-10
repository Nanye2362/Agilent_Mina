// pages/evaluation/evaluation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headHeight: '',
    scoreHeight: '',
    checkboxesHeight: '',
    textareaHeight: '',
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    halfSrc: '../../images/half.png',
    key: 0,//评分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var windowHeight = res.windowHeight;
        that.setData({
          headHeight: (windowHeight / 4.5) + 'px',
          scoreHeight: (windowHeight / 5 - 1) + 'px',
          checkboxesHeight: (windowHeight / 3.5) + 'px',
          textareaHeight: (windowHeight / 6) + 'px'
        })
      }
    });
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

  },

  selectStar: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },

  check: function () {

  },

  submit: function () {
    wx.request({
      url: 'https://devopsx.coffeelandcn.cn/agilent/web/',
      success: function (res) {
        console.log(res);
      }
    })
  }

})