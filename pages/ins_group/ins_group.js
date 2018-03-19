// pages/ins_group/ins_group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_num: 3,
    popup: false,
    gotoEdit: true,
    editGroup: true,
  },

  /* 编辑分组 */
  editGroup: function () {
    this.setData({
      gotoEdit: false,
      editGroup: false,
    })
  },
  /* 完成编辑 */
  finishGroup: function () {
    this.setData({
      gotoEdit: true,
      editGroup: true,
    })
  },

  /* 具体分组内容 */
  groupDetails: function () {
    console.log('groupDetails');
  },

  /* 删除分组 */
  delGroup: function () {

  },




  /* 添加分组 */
  showPopup: function () {
    this.setData({
      popup: true,
    })
  },
  hidePopup: function () {
    this.setData({
      popup: false,
    })
  },
  confirmPopup: function () {
    var that = this;
    that.hidePopup()
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