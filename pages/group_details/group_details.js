var newIns = require('../template/newIns.js')
var app = getApp()
// pages/group_details/group_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setMask: false,
    multiselect: false,
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国' },
    ],
    addConfirm: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    newIns.init()
  },


  /* 确认添加分组 */
  clickToConfirm: function() {
    this.setData({
      addConfirm: false,
      multiselect: false,
    })
  },



  /* 添加序列号 */
  clickToAdd: function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['从当前序列号添加', '扫描添加新序列号'],
      itemColor: '#0085d5',
      success: function (res) {       
        console.log(res.tapIndex)
        if(res.tapIndex === 0){
          that.setData({
            multiselect : true,
            addConfirm: true,
          })
        } else if ( res.tapIndex === 1 ){
          wx.navigateTo({
            //url: '../serial_number/serial_number?mobile=' + mobile,
            url: '../serial_number/serial_number'
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
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