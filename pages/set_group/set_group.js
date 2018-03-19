// pages/ins_group/ins_group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* 分组数据 */
    insGroup: [
      { name: 'GC1', value: 'GC实验仪器一', checked: 'true' },
      { name: 'GC2', value: 'GC实验仪器二'},
      { name: 'GC3', value: 'GC实验仪器三' },
    ],
    /* 弹框 */
    popup: false ,
  },

  /*  */
  radioChange: function (e) {
    console.log(e.detail.value)
  },


  /* 新建分组 */
  showPopup: function(){
    this.setData({
      popup: true,
    })
  },
  hidePopup: function(){
    this.setData({
      popup: false,
    })
  },
  confirmPopup: function(){
    var that = this;
    that.hidePopup()
  },




  /* 暂不分组 */
  nogroup: function(){
    wx.navigateTo({
      url: '/new_instrument/new_instrument'
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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