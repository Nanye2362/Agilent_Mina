// pages/labQC/labQC.js
var util = require('../../utils/util.js'); 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType:'0',
    authorized: true,
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    recordsList:[
      {
        people: 'en1',
        time: '2018-02-02',
        record: '泵修理',
      },
      {
        people: 'en2',
        time: '2019-01-06',
        record: '泵修理',
      },
      {
        people: 'en3',
        time: '2019-03-06',
        record: '泵修理',
      },
    ],
    popup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

/**
* 生命周期函数--监听页面显示
*/
onShow: function () {
  var that = this;
  util.NetRequest({
    url: '',
    data: {
    },
    success: function (res) {
      //console.log(res)
      if(res.authorized){
        that.setData({

        })
      }else{
        // wx.navigateTo({
        //   url: '../auth/auth?pageName=labQC'
        // })
      }
    },
    fail: function (err) {
      console.log(err);
    }
  })
},

/* tab */
bindChange: function (e) {
  var that = this;
  that.setData({ currentTab: e.detail.current });
},
swichNav: function (e) {
  var that = this;
  if (this.data.currentTab === e.target.dataset.current) {
    return false;
  } else {
    that.setData({
      currentTab: e.target.dataset.current
    })
  }
},

//下载并打开文件
openFile: function () {
  console.log('beginToDown')
  wx.downloadFile({
    url: "",
    success: function (res) {
      console.log(res.tempFilePath);
      wx.openDocument({
        filePath: res.tempFilePath,
        success: function (res) {
          console.log('ok');
        }
      });
    }
  })
},


//添加维修记录
bindKeyInput: function (e) {
  this.setData({
    inputValue: e.detail.value
  })
},
Popup: function (e) {
  var remarkSn = e.currentTarget.dataset.sn
  var popup = this.data.popup
  this.setData({
    popup: !popup,
    remarkSn: remarkSn,
    remarkCon: e.currentTarget.dataset.remark
  })
},



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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