var common = require("../../utils/common.js");
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    myInstrument: [{ 'product': '气象色谱', 'desc': '490-PRO气相色谱仪', 'seriNo': 'US1727636' }, { 'product': '液相色谱', 'desc': '490-PRO气相色谱仪', 'seriNo': 'US1727675' }]
  },
  clickToNext: function(event){
    common.clickToNext(event);
  },
  onLoad: function () {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
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
  clickToRemove: function(event){
    var that = this;
    var index = event.currentTarget.dataset.index;
    console.log(index);
    var myInstrument = this.data.myInstrument;
    wx.showModal({
      title: '提示',
      content: '确定要删除么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          myInstrument.splice(index,1);
          that.setData({ 'myInstrument': myInstrument});
        } else if (res.cancel) {
          console.log('用户点击取消');
          return;
        }
      }
    })
  }
})  