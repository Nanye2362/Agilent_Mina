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
    transferAction:'',
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // util.NetRequest({
    //   url: 'wechat-mini/get-global-group',
    //   success: function (res) {
    //     app.globalData.sobotData = res.data;
    //     util.getUserInfoSobot(function () {
    //       that.setData({
    //         isShow:true
    //       });
    //     });
    //     that.setData({
    //       transferAction:util.sobotTransfer(1)
    //     });
    //   }
    // });


    var scene = decodeURIComponent(options.scene)

    console.log(scene);
    if (typeof(options.scene)!='undefined'){
      this.setData({
        scene: scene,
      })
    }else{
      wx.switchTab({
        url: '../index/index',
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
    url: 'api/v1/lab/'+this.data.scene,
    method:'GET',
    success: function (res) {
      console.log(res)
      //添加后缀
      var str = res.data.lab.attachments;
      for(let i = 0;i < str.length;i++){
        var index = res.data.lab.attachments[i].name.lastIndexOf("\.");
        str[i].file_ext = str[i].name.substring(index+1,str[i].name.length);
      }
      //添加后缀
      if (res.data.is_engineer > 0){
        console.log(1111);
        that.setData({
          roleInfo: res.data,
          ldInfo: res.data.lab,
          mrInfo: res.data.maintenance,
          fileList: res.data.lab.attachments,
          ISENGINEER: res.data.is_engineer,
        })
      }else{
        if (res.data.permission) {
          if (res.data.lab.keyword) {
            that.setData({
              roleInfo: res.data,
              ldInfo: res.data.lab,
              mrInfo: res.data.maintenance,
              fileList: res.data.lab.attachments,
              ISAUTH: res.data.permission,
              ISENGINEER: res.data.is_engineer,
              Soft: 'SW_lid:' + res.data.lab.id,
              Hard: 'W_lid:' + res.data.lab.id,
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
  console.log(this.data.ldInfo.id)
  var that = this
  if(this.data.inputValue!=''){
    util.NetRequest({
      url: 'api/v1/maintenance',
      data: {
        content: that.data.inputValue,
        name: that.data.roleInfo.lab.engineer,
        lab_id: that.data.ldInfo.id,
      },
      success: function (res) {
        console.log(res)
        if (res.status) {
          var obj = {
            content: that.data.inputValue,
            name: that.data.roleInfo.lab.engineer,
            lab_id: that.data.ldInfo.id,
            created_at: res.data.create_at,
            id: res.data.id,
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
  var app = getApp();
  app.mta.Event.stat("meqia", { "group": 'SOFTWARE' });
},
isWorkTimee: function () {
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
