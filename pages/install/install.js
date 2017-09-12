// pages/install/install.js
var commondata = require('../../Data/database.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadBtn: true,
    photoURL: [],
    hasError:false,
    displayTips: false
  },

  showTips: function(){
    var displayTips = this.data.displayTips
    console.log('showtips')
    this.setData({
      displayTips: !displayTips
    })
  },


  blurfun: function (event) {
    this.setData(JSON.parse('{"' + event.target.dataset.name + '":"' + event.detail.value + '"}'));
  },
  ordercheck:function(event){
    var _orderno=event.detail.value
    if (!this._ordercheck(_orderno)){
      this.setData({ hasError: true })
    }else{
      this.setData({ hasError: false })
    }
  },
  _ordercheck: function (_orderno){
    var reStart = /^03(\d*)$/;
    if (_orderno != '' &&(_orderno.length!=10 || !reStart.test(_orderno))) {
          return false;
    }
    return true;
  },
  submit: function (event) {
    var URLArr = this.data.photoURL;
    var that = this;
    
    if (!this._ordercheck(this.data.orderno)){
      wx.showModal({
        title: '提示',
        content: '请确认信息输入完整',
        showCancel: false,
      })
      return;
    }


    if (util.checkEmpty(that.data, ['name', 'company','orderno'])) {
      wx.showModal({
        title: '提示',
        content: '请确认信息输入完整',
        showCancel: false,
      })
      return;
    }
    
    if (URLArr.length > 0) {
      util.uploadImg(URLArr, function (imgUrlList) {
        this._submit(imgUrlList);
      })
    } else {
      this._submit([]);
    }

  },
  _submit: function (imgUrlList) {
    var that = this;
    util.NetRequest({
      url: "sr/sr-instal", data: {
        username: that.data.name,
        company: that.data.company,
        from: 'wechat',
        img_1: imgUrlList[0],
        img_2: imgUrlList[1],
        img_3: imgUrlList[2],
        img_4: imgUrlList[3]
      }, fail:function(e){
        console.log(e);
      },success: function (res) {
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
  /* *
 *   点击删除图片 
  */
  clickToDelete: function (event) {
    console.log(event);
    var URLArr = this.data.photoURL;
    var index = event.target.dataset.index;
    URLArr.splice(index, 1);
    if (URLArr.length < 4) {
      this.setData({ uploadBtn: true })
    }
    this.setData({ photoURL: URLArr });
  },

  /*
  *  点击上传图片
  */
  chooseimage: function (event) {
    var _this = this;

    var URLArr = this.data.photoURL;
    console.log(URLArr);
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        URLArr = URLArr.concat(res.tempFilePaths);
        console.log(URLArr);
        if (URLArr.length == 4) {
          _this.setData({ uploadBtn: false })
        }
        if (URLArr.length > 4) {
          wx.showToast({
            title: '图片大于4张，请重新上传',
            icon: 'loading',
            duration: 2000,
            mask: 'true'
          })
          return false;
        }
        _this.setData({
          photoURL: URLArr
        });
        console.log(_this.data.photoURL)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.getUserInfo(function (user) {
      that.setData({
        name: user.name,
        company: user.company,
        mobile: user.mobile
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})