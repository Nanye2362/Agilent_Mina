// pages/confirm_info/confirm_info.js
var common = require("../../utils/common.js");
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
  },
  clickToNext: function(event){
    common.clickToNext(event);
  } ,
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.NetRequest({
      url: 'sr/sr-confirm',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.success == true) {
          this.setData({
            ProductId: res.ProductId,
            ProductDesc: res.ProductDesc,
            SerialNo: res.SerialNo,
            CpName: 
          })
          'site/product-details?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName + '&CustomerRating=' + res.CustomerRating;
        } else {
          /*
          window.location.href = host + 'site/info-setup?mobile=' + mobile;*/
          $.modal({
            title: "错误",
            text: "序列号解析有误",
            buttons: [
              { text: "重新输入", onClick: function () { hideConfirm(); } },
              {
                text: "联系客服", onClick: function () {
                  _MEIQIA('showPanel');
                  hideConfirm();
                }
              },
            ]
          });
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
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