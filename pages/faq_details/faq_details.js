// pages/faq_details/faq_details.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usefulFlag: false,
    unusefulFlag: false,
    maskFlag: true,
    TECH:'',
    answers:'',
    questions:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var that = this;
    var meiqiaInfo = wx.getStorageSync('meiqia');

    util.NetRequest({
      url: 'site-mini/faq-details',
      data: {
        'id': options.id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          TECH: meiqiaInfo.TECH,
          answers: res.detail.answers,
          questions: res.detail.questions
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

  usefulClick: function(e){
    console.log(e)
    this.setData({ usefulFlag: true, maskFlag: false });

  },
  unusefulClick:function(){
    this.setData({ unusefulFlag: true, maskFlag: false });
  },

  clickToNext: function (event) {
    console.log(event)
    var url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

})