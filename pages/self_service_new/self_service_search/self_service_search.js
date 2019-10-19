// pages/search-list/search-list.js
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      value:'',
      resultLength:0,
      resultList:[],
  },
  backHome: function () {
    util.backHome()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束
    var value = options.value;
    var that = this;
    console.log(value)
    util.NetRequest({
      url: 'site-mini/self-service-search',
      data:{
          'key_word':value
      },
      success: function (res) {
        console.log(res);
        var resultList = res.result;

        that.setData({
          value:value,
          resultList: resultList,
          resultLength: res.count,
        })
      }
    });
  },

  /**
     * 热点问题跳转
     */
  clickToFaqDetails: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../self_service_detail/self_service_detail?id=' + id,
    })

  },
})
