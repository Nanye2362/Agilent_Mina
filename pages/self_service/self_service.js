// pages/self_service/self_service.js

var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    dataList: [],
    TECH:'T',
    searchFlag: false,
    searchFake: true,
    searchValue: '',
    autofocus: false   //搜索框内自动聚焦Flag
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that  = this;

    util.NetRequest({
      url: 'site-mini/self-service',
      success: function (res) {
        console.log(res);
        var data = that.sortList(res);
         that.setData({
           dataList: data
         })
      }
    });
  },

sortList: function(list){
  var data = list.data;
  var dataL = list.data.length;
  var hots = list.hots;
  for (var i = 0; i < dataL; i++){
    for (var key in hots){
      if (data[i].id == key){
        data[i].category = hots[key];
        }
     }
  }
 return data;
},
 /**
   * 热点问题跳转
   */
  clickToFaqDetails:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id; 
    wx.navigateTo({
      url: '../faq_details/faq_details?id='+id,
    })

  },
  bindblur:function(){
    this.setData({
      searchFlag: false,
      searchFake: true,
      searchValue: ''
    })
  },

  clickToHide: function(){
    console.log(2)
      this.setData({
        searchFlag: true,
        searchFake: false,
        autofocus: true
      })

      console.log('searchFake=' + this.data.searchFake);
      console.log('searchFlag=' + this.data.searchFlag);
  },

  clickToCancel:function(){
    console.log(1)
    this.setData({
      searchFlag: false,
      searchFake: true,
      searchValue: '',
      autofocus: false
    })
  },

  clickToSearch:function(e){
    console.log('确定');
    var value = this.data.searchValue;
      wx:wx.navigateTo({
        url: '../search-list/search-list?value='+value,
      })
  },
  bindInput:function(e){
    console.log(e);
    var value = e.detail.value;
    var inputLength = e.detail.value.length;
    this.setData({
      searchValue: value
    })
  },

  /** 
   * 点击tab切换 
   */
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

  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

   /** 
     * 点击问题分类进入faq页面
     */
  clickToFaq: function(e){
    console.log(e);
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../faq/faq?id='+id,
      })
  },

  clickToRepair:function(){
    util.checkWorktime(function(){
        //是工作时间跳转serial number页面
          wx.navigateTo({
            url: '../serial_number/serial_number',
          })
    },function(){
         //是工作时间跳转leave-message页面
            wx.navigateTo({
              url: '../leave_message/leave_message',
            })
    })
  }
})