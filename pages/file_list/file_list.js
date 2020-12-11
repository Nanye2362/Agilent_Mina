// pages/file_list/file_list.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    fileList:[{
      file_name:'3000276650-LC报价单.pdf',
      file_url:'https://agilent-aws-tst-26-kakao-eservice.s3-ap-northeast-1.amazonaws.com/web/upload_file/admin/sendToRepair/files/0/5fc9c66b9bded_3000276650-LC报价单.pdf',
      id:0
    },{
      file_name:'3000276651-LC送修报价单.pdf',
      file_url:'https://agilent-aws-tst-26-kakao-eservice.s3-ap-northeast-1.amazonaws.com/web/upload_file/admin/sendToRepair/files/0/5fc9c66b9bded_3000276650-LC报价单.pdf',
      id:1
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(typeof(options.id)!='undefined'){
      this.data.id=options.id;
      this.getBqList();
    }
  },
  getBqList:function(){
    var that=this;
    util.NetRequest({
      url: 'api/v1/sr/files?id='+that.data.id,
      method: 'GET',
      success: function (r) {
        console.log('获取文件：',r);
      }})
  },
  openPDF: function () {
    var token = wx.getStorageSync('token');
    var url = util.Server + 'api/v1/bq-pdf/open?objectid=' + this.data.
    wx.showLoading({
      title: '加载中，请稍候',
      mask: true
    })
    const downloadTask = wx.downloadFile({
      url: url,
      header: {
        'Authorization': "Bearer " + token
      },
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        console.log('filePath= ' + filePath);
        if(res.statusCode==200){
          wx.openDocument({
            filePath: filePath,
            success: function success(res) {
              console.log('打开文档成功');
            },
            fail: function fail(res) {
              console.log(res);
              wx.showModal({
                title: '提示',
                content: '报告显示错误。如果需要此报告，请联系客服索取。',
                showCancel: false
              });
            }
          })
        }else{
          if(res.statusCode==400){
            wx.showModal({
              title: '提示',
              content: 'PDF生成中请稍后',
              showCancel: false
            });
            return false
          }
        }
        
      },
      complete: function complete() {
        wx.hideLoading();
      },
      fail: function fail() {
        wx.showModal({
          title: '提示',
          content: 'PDF生成中请稍后',
          showCancel: false
        });
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