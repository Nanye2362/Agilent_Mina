var common = require("../../utils/common.js");
var util = require('../../utils/util.js');
var app = getApp()
var mobile=''
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    InstrumentCount: 7,
    myInstrument: [{ 'product': '气象色谱', 'desc': '490-PRO气相色谱仪', 'seriNo': 'US1727636' }, { 'product': '液相色谱', 'desc': '490-PRO气相色谱仪', 'seriNo': 'US1727675' }]
    displayState: false,
    InstrumentCount: 0,
    InstrumentList: [{}],
    ContactGuid:'',
    ContactId:'',
    AccountGuid:'',
    AccountId:'',
  },
  clickToNext: function(event){
    common.clickToNext(event);
  },

  
  onLoad: function () {
    mobile = wx.getStorageSync(mobile);
    console.log('mobile======='+mobile)
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

    util.NetRequest({
      url: 'site-mini/my-instrument',
      data: {
      },
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
          displayState: true,
        })
        that.setData({
          InstrumentCount: res.InstrumentCount,
          InstrumentList: res.InstrumentList,
          ContactGuid: res.ContactGuid,
          ContactId: res.ContactId,
          AccountGuid: res.AccountGuid,
          AccountId: res.AccountId,
        }) 
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //报修历史
  clickToNext: function (event) {
    var sn = event.currentTarget.dataset.sn;
    var contactId = event.currentTarget.dataset.contactid;
    wx.navigateTo({
      url: '../service_list/service_list?sn=' + sn + '&contactId=' + contactId,
    })
  },
  //报修
  clickToRepair: function (event) {
    var sn = event.currentTarget.dataset.sn;
    var contactId = event.currentTarget.dataset.contactid;
    var contactGuid = event.currentTarget.dataset.contactguid;
    var accountGuid = event.currentTarget.dataset.accountguid;
    var accountId = event.currentTarget.dataset.accountid;
    wx.navigateTo({
      url: '../confirm_info/confirm_info?sn=' + sn + '&contactId=' + contactId + '&contactGuid=' + contactGuid + '&accountGuid=' + accountGuid + '&accountId=' + accountId,
    })
  },
  //添加仪器
  clickToAdd: function () {
    wx.redirectTo({
      url: '../serial_number/serial_number?mobile=' + mobile,
    })
  },

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
    var InstrumentList = this.data.InstrumentList;
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