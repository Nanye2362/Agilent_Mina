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
    dropdown: false,
    serviceList: [{ 'slNo': 'SR80109394845432', 'slState': '等待报价确认', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }, { 'slNo': 'SR80109394845432', 'slState': '完成确认', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }, { 'slNo': 'SR80109394845432', 'slState': '等待报价确认', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }, { 'slNo': 'SR80109394845432', 'slState': '完成确认', 'slReason': 'SR80109394845432', 'slSN': 'RS-PRO-z0290384848', 'slDate': '2017年6月18日09:00 ' }]
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
  tagShow: function(){
    var that = this;
    this.setData({dropdown: !that.data.dropdown});
  },

  clickToHide:function(){
    console.log(this);
    this.setData({dropdown: false});
  }
})  