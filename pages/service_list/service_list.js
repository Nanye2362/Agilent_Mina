var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    dropdown: false,
    reportFlag: false,
    InstrumentCount: 0,
    HistoryResults: [{}],
    serviceListAll: [{ 'slNo': 'SR80109394845432', 'slState': '1', 'slStateDes': '等待报价确认', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }, { 'slNo': 'SR80109394845432', 'slState': '1', 'slStateDes': '已安排工程师', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }, { 'slNo': 'SR80109394845432', 'slState': '2', 'slStateDes': '我的评价', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }, { 'slNo': 'SR80109394845432', 'slState': '3', 'slStateDes': '前往评价', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }],
    serviceListUnderEvaluate:[{}]

  },

  onLoad: function (options) {
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

    //请求后台接口
    util.NetRequest({
      url: 'site-mini/service-list',
      data: {
        ContactId: 'ContactId',
        SerialNo: 'SerialNo'
      },
      success: function (res) {
        console.log(res); //后台获取到的history数据
        that.setData({
          InstrumentCount: res.InstrumentCount,
          HistoryResults: res.HistoryResults
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
  tagShow: function(){
    var that = this;
    this.setData({dropdown: !that.data.dropdown});
  },

  clickToHide:function(){
    console.log(this);
    this.setData({dropdown: false});
  }
})  