// pages/search-list/search-list.js
var util = require('../../utils/util.js');
const config = require("../../config.js");


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
      url: 'api/v1/guide/article/search?keyword='+value+'&type=0',
      method:'GET',
      success: function (res) {
        console.log(res);
        var resultList = res.data.search_results;
      
        that.setData({
          value:value,
          resultList: resultList,
          resultLength: res.data.total_records,          
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
    wx.setStorage({
      key: "openHtmlUrl",
      data: config.Server+'wechat/h5/faq/details/'+id,//https://qa.wechat.service.agilent.com/
      success: function () {
          wx.navigateTo({
              url: '../html/openHtml',
          });
      }
    })
    return false;

  },
})