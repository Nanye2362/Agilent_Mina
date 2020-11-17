// pages/add_label/add_label.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [{
      img: "https://prd.wechat.service.agilent.com/web/images/20200913/banner1.jpg",
      title: "山东官方：德尔加多已完成全部手续办理，具备上场比赛资格"
    }, {
      img: "https://prd.wechat.service.agilent.com/web/images/20200906/banner2.jpg",
      title: "这个世界上，或许没有真正的托黑"
    }, {
      img: "banner_3.jpg",
      title: "金童再见！西班牙前锋托雷斯宣布退役"
    }],
    newsList: [{
      title: "每周二下午四点:锁定气相气质系列直播 干货满满",
      source: "气相气质好习惯系列",
      cmtsNum: 2019,
      isTop: true,
      isVideo: false,
      time: "00:00",
      img: "https://prd.wechat.service.agilent.com/web/images/20200913/banner1.jpg",
      imgNum: 1
    }, {
      title: "每周三下午四点:大咖云集液相液质系列直播 优惠继续",
      source: "液质液相精彩集锦",
      cmtsNum: 3620,
      isTop: true,
      isVideo: false,
      time: "00:00",
      img: "https://prd.wechat.service.agilent.com/web/images/20200913/banner1.jpg",
      imgNum: 1
    }, {
      title: "每周四下午四点:光谱/ICPOES/软件维护 收入囊中",
      source: "光谱/OpenLab CDS 软件维护系列",
      cmtsNum: 3620,
      isTop: true,
      isVideo: false,
      time: "00:00",
      img: "https://prd.wechat.service.agilent.com/web/images/20200913/banner1.jpg",
      imgNum: 1
    }],
  },

  toPlayBack:function(){
    wx.navigateTo({
      url: '../play_back/play_back'
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