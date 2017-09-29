// pages/search-list/search-list.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      value:'',
      resultLength:0,
      resultList:[]
  },
  backHome: function () {
    util.backHome()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var value = options.value;
        var that = this;
        console.log(value)
        util.NetRequest({
          url: 'site-mini/search-result',
          data:{
              'key_word':value
          },
          success: function (res) {
            console.log(res);
            var resultList = res.result;
            var resultLength = 0 ;
            if(resultList.length){
              resultLength = resultList.length;
            }
          
           that.setData({
             value:value,
             resultList: resultList,
             resultLength: resultLength
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
      url: '../faq_details/faq_details?id=' + id,
    })

  },
})