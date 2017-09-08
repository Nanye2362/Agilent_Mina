// pages/serial_number/serial_number.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:'',
    inputValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        

        //上传图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: util.Server +'test/ocr-test', 
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = res.data;
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
            _this.setData({
              tempFilePaths:tempFilePaths
            })
          },
          fail: function(res){
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '上传失败，请检查网络后重试',
              success: function (sm) {
                if (sm.confirm) {
                  console.log('点击确认')

                } else if (sm.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      }
    })
  },

  saveTheValue: function(e){
    console.log(e.detail.value)
      this.setData({ inputValue: e.detail.value })
  },
 
  clickToSubmit: function (){
    var serNum = this.data.inputValue;
      
    util.NetRequest({
      url: 'sr/sr-confirm',
      data: serNum,
      success: function(res){
        console.log(res);
        if (res.success == true) {
          wx.navigateTo({
            url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '序列号验证有误',
            cancelText: '联系客服',
            cancelColor: '#3CC51F',
            confirmText: '重新上传',
            success: function (sm) {
              if (sm.confirm) {
                //重新上传
                console.log('点击确认')

              } else if (sm.cancel) {
                //联系客服，调用美洽
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  }
})