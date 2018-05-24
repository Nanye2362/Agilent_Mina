// pages/labQC/labQC.js
var util = require('../../utils/util.js'); 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ISAUTH: 0,
    ISENGINEER: -1,
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    popup: false,
    Soft:'',
    Hard:'',
    isDown: false,
    percent: 0,
    inputValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkWorkTime();
    var scene = decodeURIComponent(options.scene)   
    if (options.scene!=''){
      this.setData({
        scene: scene,
      })
    }else{
      wx.navigateTo({
        url: '../index/index'
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


/**
* 生命周期函数--监听页面显示
*/
onShow: function (options) {
  var that = this
  util.NetRequest({
    url: 'labqc/get-forminfo',
    data: {
      lid: this.data.scene,
    },
    success: function (res) {
      console.log(res)
      if (res.roleInfo.ISENGINEER > 0){
        console.log(1111);
        that.setData({
          roleInfo: res.roleInfo,
          ldInfo: res.ldInfo,
          mrInfo: res.mrInfo,
          fileList: res.fileList,
          ISENGINEER: res.roleInfo.ISENGINEER,
        })
      }else{
        if (res.roleInfo.ISAUTH == 1) {
          if (res.roleInfo.CpKeyword) {
            that.setData({
              roleInfo: res.roleInfo,
              ldInfo: res.ldInfo,
              mrInfo: res.mrInfo,
              fileList: res.fileList,
              ISAUTH: res.roleInfo.ISAUTH,
              ISENGINEER: res.roleInfo.ISENGINEER,
              Soft: 'SW_lid:' + res.ldInfo.LaboratoryID,
              Hard: 'W_lid:' + res.ldInfo.LaboratoryID,
            })
          } else {
            wx.showModal({
              title: '查看失败',
              content: '您暂无权限查看该功能，请联系相关系统管理员',
              showCancel: false,
              success: function (res) {
                console.log('should go to index');
                wx.switchTab({
                  url: '../index/index'
                })
              }
            })
          }
        } else {
          wx.navigateTo({
            url: '../auth/auth?pageName=labQC'
          })
        }
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
openFile: function (event) {
  var that = this;
  this.setData({
    isDown: true
  })
  var url = event.currentTarget.dataset.url;
  console.log(url);
  const downloadTask = wx.downloadFile({
    url: url,
    success: function (res) {
      console.log(res);
      console.log('download succeed！！！！');
      that.setData({
        isDown: false,
        percent: 0,
      })
      wx.openDocument({
        filePath: res.tempFilePath,
        success: function (res) {
          console.log(res)
          console.log('open success!!!!');
        }, 
        fail: function (res) {
          console.log('open fail')
          console.log(res)
        },
        complete: function (res) {
          console.log('complete')
          console.log(res)
        }
      });
    }
  })

  downloadTask.onProgressUpdate((res) => {
    var that =this;
    that.setData({
      percent: res.progress,
    })
    console.log('下载进度', res.progress)
    //console.log('已经下载的数据长度', res.totalBytesWritten)
    //console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
  })
},








//添加维修记录
bindKeyInput: function (e) {
  this.setData({
    inputValue: e.detail.value
  })
},
confirmAdd: function(){
  console.log(this.data.ldInfo.LaboratoryID)
  var that = this
  if(this.data.inputValue!=''){
    util.NetRequest({
      url: 'labqc/create-mrecord',
      data: {
        MaintenanceContent: that.data.inputValue,
        SubmitPerson: that.data.roleInfo.ENGINEERNAME,
        LaboratoryID: that.data.ldInfo.LaboratoryID,
      },
      success: function (res) {
        console.log(res)
        if (res.create_result) {
          var obj = {
            MaintenanceContent: that.data.inputValue,
            SubmitPerson: that.data.roleInfo.ENGINEERNAME,
            LaboratoryID: that.data.ldInfo.LaboratoryID,
            SubmitTime: res.SubmitTime,
            ID: res.ID,
          }
          that.data.mrInfo.unshift(obj);
          that.setData(that.data);
        } else {
          wx.showModal({
            title: '添加失败',
            content: '服务器错误，请重新尝试',
            showCancel: false,
            success: function (res) {
            }
          })
        }
        that.Popup();
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }else{
    wx.showModal({
      title: '提交失败',
      content: '内容不能为空',
      showCancel: false,
      success: function (res) {
      }
    })
  }
  
},

Popup: function (e) {
  var popup = this.data.popup;
  this.setData({
    popup: !popup,
    inputValue: '',
  })
},

//检测工作时间
isWorkTime: function () {
  util.isWorkTime();
  var app = getApp();
  app.mta.Event.stat("meqia", { "group": 'SOFTWARE' });
},
isWorkTimee: function () {
  util.isWorkTime();
  var app = getApp();
  app.mta.Event.stat("meqia", { "group": 'WLA' });
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
  
  },

})