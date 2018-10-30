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
        url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      },
      {
        id: 2,
        poster: '/images/cover.jpg',
        title: '2.安捷伦液相色谱仪-完整拆机步骤',
        url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      },
      {
        id: 3,
        poster: '/images/cover.jpg',
        title: '3.安捷伦液相色谱仪拆装机-G1367E自动进样器',
        url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      },
      {
        id: 4,
        poster: '/images/cover.jpg',
        title: '4.安捷伦液相色谱仪拆装机-四元泵',
        url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      },
      {
        id: 5,
        poster: '/images/cover.jpg',
        title: '5.安捷伦液相色谱仪-CAN线LAN线连接步骤',
        url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      },
      {
        id: 6,
        poster: '/images/cover.jpg',
        title: '6.安捷伦液相色谱仪拆装-seal-wash管线拆卸',
        url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      },
      {
        id: 7,
        poster: '/images/cover.jpg',
        title: '7.安捷伦气相色谱仪自动进样器送修包装指南',
        url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      },
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