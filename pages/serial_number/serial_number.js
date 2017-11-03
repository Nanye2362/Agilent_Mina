// pages/serial_number/serial_number.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
    inputValue: '',
    ContactGuid: '',
    ContactId: '',
    AccountGuid: '',
    AccountId: '',
    chat: false,
    NONTECH: 'W_ssn:',
    cameraValue: '',
    shLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.NetRequest({
      url: 'site-mini/serial-no',
      data: '',
      success: function (res) {
        console.log(res);
        that.setData({
          ContactGuid: res.ContactGuid,
          ContactId: res.ContactId,
          AccountGuid: res.AccountGuid,
          AccountId: res.AccountId
        })
      }
    })
  },
  
  chooseimage: function () {
    var _this = this;
    var app=getApp();
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        //上传图片
        /*
        wx.showLoading({
          title: '上传中...',
          mask: true
        })*/
        _this.setData({
          shLoading: true,
        })
        var tempFilePaths = res.tempFilePaths;
        app.globalData.isUploading = true;
        wx.uploadFile({
          url: util.Server + 'api/ocr-scan',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            console.log(res)
            var value = JSON.parse(res.data).result;
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
            if (value){
              _this.setData({
                cameraValue: value,
                inputValue: value
              });
            }else{
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
          complete: function(){
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
      }
    })
  },

  saveTheValue: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    this.setData({ inputValue: value })
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

  clickToSubmit: function (event) {
    var that = this;
    var serNum = this.data.inputValue;
    var contactguid = event.currentTarget.dataset.contactguid;
    var contactid = event.currentTarget.dataset.contactid;
    var accountguid = event.currentTarget.dataset.accountguid;
    var accountid = event.currentTarget.dataset.accountid;

    util.NetRequest({
      url: 'sr/sr-confirm',
      data: {
        contact_guid: contactguid,
        contact_id: contactid,
        account_guid: accountguid,
        account_id: accountid,
        serial_number: serNum
      },
      success: function (res) {
        console.log(res);
        if (res.success == true) {
          wx.redirectTo({
            url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName,
          })
        } else {
         
          if(res.check_sn == false){
            that.setData({
              chat: true,
            })
            wx.showModal({
              title: '提示',
              cancelText: '返回',
              content: '序列号解析有误。您可以重新确认序列号然后上传。如有疑问，请返回点击页面下方发起会话与我们联系。',
              confirmText: '重新上传',
              success: function (sm) {
                if (sm.confirm) {
                  //重新上传
                  console.log('点击确认')
                } else if (sm.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            that.setData({
              chat: true,
            })
            wx.showModal({
              title: '提示',
              content: '序列号与单位关联失败，如果您有任何疑问，可以点击页面下方的发起会话按钮',
              cancelText: '返回',
              cancelColor: '#3CC51F',
              confirmText: '重新上传',
              success: function (sm) {
                if (sm.confirm) {
                  //重新上传
                  console.log('点击确认')
                } else if (sm.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
          
        }
      }
    })
  },
  
})