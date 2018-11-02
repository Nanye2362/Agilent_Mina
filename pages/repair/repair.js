// pages/repair/repair.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    curr_id: '',
    sn: '',
    TECH: 'T_rsn:',
    imgUrl: config.Server + 'images/Send_banner.jpg',
    imgUrls: [
      {
        url: config.Server + 'images/Send_1.jpg',
      },
      {
        url: config.Server + 'images/Send_2.jpg',
      },
      {
        url: config.Server + 'images/Send_3.jpg',
      },
      {
        url: config.Server + 'images/Send_4.jpg',
      },
      {
        url: config.Server + 'images/Send_5.jpg',
      }
    ],
    videoUrls:[
      {
        id:1,
        poster: '/images/cover.jpg',
        title: '1.安捷伦液相色谱仪-完整装机步骤',
        url: 'http://video.coffeelandcn.cn/739d12cd3b2547048102634ab2f662ba/ecd446d6446b48d3966edaa7eebc0495-5287d2089db37e62345123a1be272f8b.mp4',
      },
      {
        id: 2,
        poster: '/images/cover.jpg',
        title: '2.安捷伦液相色谱仪-完整拆机步骤',
        url: 'http://video.coffeelandcn.cn/6767776904074295b4a0e535af471034/26298d82bb9e4bdf9e30081b2248d946-5287d2089db37e62345123a1be272f8b.mp4',
      },
      {
        id: 3,
        poster: '/images/cover.jpg',
        title: '3.安捷伦液相色谱仪拆装机-G1367E自动进样器',
        url: 'http://video.coffeelandcn.cn/c91e9ed964474eb18c2d04b110b6eb13/c12a056418dc43a49263a38f16f69d4c-5287d2089db37e62345123a1be272f8b.mp4',
      },
      {
        id: 4,
        poster: '/images/cover.jpg',
        title: '4.安捷伦液相色谱仪拆装机-四元泵',
        url: 'http://video.coffeelandcn.cn/da32a6eb8a9f44a0b84fae1a42876549/ec7336319b044ed8b1da8530c2e6945e-5287d2089db37e62345123a1be272f8b.mp4',
      },
      {
        id: 5,
        poster: '/images/cover.jpg',
        title: '5.安捷伦液相色谱仪-CAN线LAN线连接步骤',
        url: 'http://video.coffeelandcn.cn/911e14c70705404d915889c83aed2b1c/bd47ee8fca9c4ff4bb081ad4a78e5c3e-5287d2089db37e62345123a1be272f8b.mp4',
      },
      {
        id: 6,
        poster: '/images/cover.jpg',
        title: '6.安捷伦液相色谱仪拆装-seal-wash管线拆卸',
        url: 'http://video.coffeelandcn.cn/d3ce83f0428c4af4bc86e997c07e2b5c/f1eb247348e841bca7fd5ba44e33e47b-5287d2089db37e62345123a1be272f8b.mp4',
      }
     
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.sn!=undefined){
      this.setData({
        sn: options.sn
      })
    }
    /* 获取系统信息 */
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  //视频播放
  videoPlay: function(event) {
    var videoId = event.currentTarget.dataset.vid;
    console.log(videoId)
    var that = this; 
    that.setData({
      curr_id: event.currentTarget.dataset.id,
    })
    wx.getStorage({
      key: videoId,
      success: function (res) {
        console.log("获取缓存成功！");
        console.log(res.data)
        that.videoContext.seek(res.data);
      }
    })       
    //that.videoContext.play()
  },
  //页面滑动暂停视频播放
  handletouchmove: function(){
    this.setData({
      curr_id:'',
    })
    this.videoContext.pause()
  },
  MtaReport: function () {
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'NONTECH' });
  },
  //视频续播
  goOnVideo: function(event){ 
    var detail = event.detail;
    var videoId = event.currentTarget.dataset.vid;
    wx.setStorage({
      key: videoId,
      data: detail.currentTime,
      success(res) {
        console.log("保存成功！")
      }
    })
  },
  swichNav: function (e) {
    this.handletouchmove();
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  noSn: function(){
    wx.navigateTo({
      url: '../serial_number/serial_number',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo');
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