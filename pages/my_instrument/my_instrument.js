var util = require('../../utils/util.js');
var app = getApp()
var mobile = ''
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    displayState: false,
    InstrumentCount: 0,
    InstrumentList: [{}],
    ContactGuid: '',
    ContactId: '',
    AccountGuid: '',
    AccountId: '',
  },


  onLoad: function () {

    mobile = wx.getStorageSync(mobile);
    console.log('mobile=======' + mobile)
    var that = this;
    util.NetRequest({
      url: 'site-mini/my-instrument',
      data: {
      },
      success: function (res) {
        console.log(res)
        that.setData({
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
    this.setData({'sn': sn})
    var contactId = event.currentTarget.dataset.contactid;
    var that = this;
    util.NetRequest({
      url: 'sr/history',
      data: {
        ContactId: contactId,
        SerialNo: sn
      },
      success: function (res) {
        if (res.success == true) {
          wx.navigateTo({
            url: '../service_list/service_list?sn=' + sn + '&contactId=' + contactId,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '该仪器暂无报修历史',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    });
    
    
  },
  //报修
  clickToRepair: function (event) {
    var sn = event.currentTarget.dataset.sn;
    var contactId = event.currentTarget.dataset.contactid;
    var contactGuid = event.currentTarget.dataset.contactguid;
    var accountGuid = event.currentTarget.dataset.accountguid;
    var accountId = event.currentTarget.dataset.accountid;

    util.NetRequest({
      url: 'sr/sr-confirm',
      data: {
        contact_guid: contactGuid,
        contact_id: contactId,
        account_guid: accountGuid,
        account_id: accountId,
        serial_number: sn
      },
      success: function (res) {
        console.log(res);
        if (res.success == true) {
          wx.navigateTo({
            url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName,
          })
        }
      }
    })
  },
  //添加仪器
  clickToAdd: function () {
    wx.navigateTo({
      url: '../serial_number/serial_number?mobile=' + mobile,
    })
  },

  //删除仪器
  clickToRemove: function (event) {
    var that = this
    var index = event.currentTarget.dataset.index;
    console.log(index);
    var InstrumentList = this.data.InstrumentList;
    wx.showModal({
      title: '提示',
      content: '确定要删除么',
      success: function (res) {
        if (res.confirm) {
          util.NetRequest({
            url: 'sr/delete-instrument',
            data: {
              'SerialNo': InstrumentList[index].SerialNo,
              'ProductId': InstrumentList[index].ProductId,
            },
            success: function (res) {
              var InstrumentCount = that.data.InstrumentCount;
              that.setData({
                InstrumentCount: InstrumentCount-1,
              })
              console.log('用户点击确定');
              InstrumentList.splice(index, 1);
              that.setData({ 'InstrumentList': InstrumentList });
            },
            fail: function (err) {
              wx.showToast({
                title: '删除失败',
                icon: 'fail',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
          return;
        }
      }
    })
    
  }
})  