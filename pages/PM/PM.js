// pages/PM/PM.js
var util = require('../../utils/util.js');
var isSend=false;
var config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {    
    displayTips: false,
    chooseDate: '',
    inputValue:'',
    desc:'',
    showTextarea: true,
    shLoading: false,
    imgUrl: config.Server + 'images/pm.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mta统计结束
    var that = this;
    util.getUserInfo(function (user) {
      that.setData({
        name: user.name,
        company: user.company,
        mobile: user.mobile
      })
    });
  },
  //多选框
  checkboxChange: function (e) {
    var that = this;
    console.log(e.detail.value)
    var sl = e.detail.value
  },

  //附加信息
  desNo: function (e) {
    this.setData({
      desc: e.detail.value
    });
  },
  formSubmit: function (e) {
    var clickevent = e.detail.target.dataset.click;
    console.log(e.detail.formId);
    util.submitFormId(e.detail.formId);
    this[clickevent](e.detail.target);
  },
  //蓝色问号说明
  showTips: function (e) {
    console.log(e);
    var attachNo = e.currentTarget.dataset.no;
    var displayTips = this.data.displayTips
    console.log('showtips')
    this.setData({
      attachNo: attachNo,
      displayTips: !displayTips,
      showTextarea: !this.data.showTextarea,
    })
  },

  MtaReport: function () {
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'WLA' });
  },
  submit: function (event) {
    var that = this;
    if (util.checkEmpty(that.data, ['name', 'company','inputValue'])) {
      wx.showModal({
        title: '提示',
        content: '请确认信息输入完整',
        showCancel: false,
      })
      return;
    }
    if (isSend) {
      return false;
    }
    isSend = true;
    wx.showLoading({
      title: '提交中，请稍候',
      mask: true
    })
    that._submit();
 
  },
  _submit: function () {
    var that = this;
    util.NetRequest({
      showload: false,
      url: "sr/preventive-maintenance", 
      data: {
        UserName: that.data.name,
        Company: that.data.company,
        from: 'wechat',
        SerialNo: that.data.inputValue,
        ConfigInfo: that.data.desc,
        ExpectedDate: that.data.chooseDate,
      }, 
      fail: function (e) {
        console.log(e);
        isSend = false;
      }, 
      success: function (res) {
        isSend = false;
        console.log(res);
        if (res.success) {
          wx.showModal({
            title: '提交成功',
            content: '您的安装申请已提交成功，服务调度中心将会与您联系确认服务时间以及工程师安排事宜',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                });
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '发生错误，请联系客服',
            showCancel: false
          })
        }
      }
    })
  },
  chooseimage: function () {
    var _this = this;
    var app = getApp();
    app.globalData.isUploading = true;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        _this.setData({
          shLoading: true,
        })
        var startTime = new Date();
        var tempFilePaths = res.tempFilePaths;
        var session_id = wx.getStorageSync('PHPSESSID');
        if (session_id != "" && session_id != null) {
          var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id }
        } else {
          var header = { 'content-type': 'application/x-www-form-urlencoded' }
        }
        console.log(util.ocrServer + 'api/ocr-scan');
        wx.uploadFile({
          url: util.ocrServer + 'api/ocr-scan',
          filePath: tempFilePaths[0],
          name: 'file',
          header: header,
          success: function (res) {
            console.log(res)
            var endTime = new Date();
            var ocrSpend = endTime - startTime;
            console.log(ocrSpend);

            util.NetRequest({
              host: util.ocrServer,
              url: 'api/ocr-spend',
              showload: false,
              data: {
                ocrSpend: ocrSpend,
                serverStart: JSON.parse(res.data).serverStart,
                serverEnd: JSON.parse(res.data).serverEnd,
              },
              success: function (res) {
              }
            })

            var value = JSON.parse(res.data).result;
            var app = getApp();
            app.mta.Event.stat("sn_ocr", { "sn": value });
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
            if (value) {
              _this.setData({
                cameraValue: value,
                inputValue: value
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '解析失败，请上传正确图片',
                showCancel: false,
                success: function (sm) {
                  if (sm.confirm) {
                    console.log('点击确认')
                  }
                }
              })
            }
          },
          complete: function () {
            _this.setData({
              shLoading: false,
            })
            //wx.hideLoading();
            app.globalData.isUploading = false;
          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '上传失败，请检查网络后重试',
              showCancel: false,
              success: function (sm) {
                if (sm.confirm) {
                  console.log('点击确认')
                }
              }
            })
          }
        })
      },
      fail: function () {
        app.globalData.isUploading = false;
      }
    })
  },
  saveTheValue: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    this.setData({ inputValue: value.toUpperCase() })
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(value, value.toUpperCase()),
      cursor: pos
    }


    /*
    var inputValue = e.detail.value.toUpperCase()
    console.log(inputValue)
    this.setData({ inputValue: inputValue })
    console.log(e);
    */
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