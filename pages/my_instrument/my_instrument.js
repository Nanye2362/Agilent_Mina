var util = require('../../utils/util.js');
var newIns = require('../template/newIns.js')
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
    SerialCount: 0,
    InstrumentList: [{}],
    ContactGuid: '',
    ContactId: '',
    AccountGuid: '',
    AccountId: '',
    showFilter: false,
    popup: false
  },
  


  

  onLoad: function () {
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    newIns.init();
    //腾讯mta统计结束

    mobile = wx.getStorageSync(mobile);
    console.log('mobile=======' + mobile)
    
  },
  
  onShow: function(){
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

        var instrumentlist = res.InstrumentList;
        var instrumentList = [];
        for (var i in instrumentlist) {
          instrumentlist[i].setMask = false;
          instrumentlist[i].idx = i;
          instrumentList.push(instrumentlist[i]);
        }

        that.setData({
          InstrumentCount: res.InstrumentCount,
          InstrumentList: instrumentList,
          ContactGuid: res.ContactGuid,
          ContactId: res.ContactId,
          AccountGuid: res.AccountGuid,
          AccountId: res.AccountId,
          GroupCount: res.GroupCount,
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },



  //'设置'菜单隐藏
  clickToSet: function (e) {
    console.log(e.currentTarget.dataset.index)
    for (var i = 0; i < this.data.InstrumentList.length; i++) {
      if (e.currentTarget.dataset.idx == i) {
        this.data.InstrumentList[i].setMask = true
      }
      else {
        this.data.InstrumentList[i].setMask = false
      }
    }
    this.setData(this.data)
  },
  /* 仪器总分组 */
  gotoGroup: function() {
    wx.navigateTo({
      url: '../ins_group/ins_group'
    })
  },

  /* 设置单独仪器分组 */
  setGroup: function(e){
    var sn = e.currentTarget.dataset.sn;
    console.log(e.currentTarget.dataset.sn);
    wx.navigateTo({
      url: '../set_group/set_group?sn='+sn
    })
  },
  /* 添加标签 */
  addLabel: function (e) {
    var sn = e.currentTarget.dataset.sn;
    wx.navigateTo({
      url: '../add_label/add_label?sn='+sn
    })
  },

  
  /* 修改备注 */
  confirmRemark: function () {
    var that = this;
    util.NetRequest({
      url: 'site-mini/edit-remark',
      data: {
        'Remark': this.data.inputValue,
        'SerialNo': this.data.remarkSn
      },
      success: function (res) {
        console.log(res)
        if(res.result){
          var instrumentlist = that.data.InstrumentList;
          for (var i in instrumentlist) {
            if (instrumentlist[i].SerialNo == that.data.remarkSn) {
              instrumentlist[i].Remark = that.data.inputValue;
            }
          }
          that.setData({
            InstrumentList: instrumentlist,
          })
        }
        that.setData({
          popup: !that.data.popup
        })               
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  Popup: function (e) {
    var remarkSn = e.currentTarget.dataset.sn
    var popup = this.data.popup
    this.setData({
      popup: !popup,
      remarkSn: remarkSn
    })
  },


  //报修历史
  clickToNext: function (event) {
    var sn = event.currentTarget.dataset.sn;
    this.setData({ 'sn': sn })
    var that = this;
    util.NetRequest({
      url: 'sr/history',
      data: {
        ContactId: this.data.ContactId,
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
            content: '该仪器三个月内无报修记录',
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
    console.log(this.data.contactGuid)
    console.log(this.data.contactId)
    util.NetRequest({
      url: 'sr/sr-confirm',
      data: {
        contact_guid: this.data.ContactGuid,
        contact_id: this.data.ContactId,
        account_guid: this.data.AccountGuid,
        account_id: this.data.AccountId,
        serial_number: sn
      },
      success: function (res) {
        console.log(res);
        if (res.success == true) {
          wx.redirectTo({
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
    var sn = event.currentTarget.dataset.sn;
    var pi = event.currentTarget.dataset.pi;
    var idx = event.currentTarget.dataset.idx;
    console.log(sn+pi);
    var InstrumentList = this.data.InstrumentList;
    wx.showModal({
      title: '提示',
      content: '确定要删除么',
      success: function (res) {
        if (res.confirm) {
          util.NetRequest({
            url: 'sr/delete-instrument',
            data: {
              'SerialNo': sn,
              'ProductId': pi,
            },
            success: function (res) {
              console.log(res);
              if(res.success){
                for (var i in InstrumentList) {
                  if (InstrumentList[i].SerialNo == sn) {
                    InstrumentList.splice(i, 1)
                  }
                  if (InstrumentList[i].idx> idx){
                    InstrumentList[i].idx -= 1 ;
                  }
                }
                var InstrumentCount = that.data.InstrumentCount;
                that.setData({
                  InstrumentCount: InstrumentCount - 1,
                  InstrumentList: InstrumentList 
                })
                console.log('用户点击确定');
              }
              
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

  },


  /* 筛选框 */
  clickfilter: function () {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },
  /* 更多仪器分组 */
  moreGroup: function () {
    this.setData({
      showMoreGroup: !this.data.showMoreGroup
    })
  },




  backHome: function () {
    util.backHome()
  },
})  