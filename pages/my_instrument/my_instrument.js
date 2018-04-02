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
    popup: false,
    showMoreGroup: false,
    filterActive: false,
    selectLabel: '不限',
    selectGroup: '',
    GroupCount: 0,
    remarkCon: '',
    /* 搜索弹框 */
    searchShow: false,
    searched: false,
    searchValue:'',
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

  onShow: function () {
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

        var gl = res.GroupList;
        var GroupList = [];
        for (var i in gl) {
          gl[i].filterActive = false;
          gl[i].idx = i;
          GroupList.push(gl[i]);
        }

        var ll = res.LabelList;
        var LabelList = [];
        var object = {
          ID: '',
          LabelName: '不限',
          LabelColor: '',
          filterActive: true,
          idx: 0,
          labelView: false,
        }
        LabelList.unshift(object);
        for (var i in ll) {
          ll[i].filterActive = false;
          ll[i].idx = parseInt(i) + 1;
          ll[i].labelView = true;
          LabelList.push(ll[i]);
        }

        that.setData({
          InstrumentCount: res.InstrumentCount,
          InstrumentList: instrumentList,
          AllInstrument: instrumentList,
          ContactGuid: res.ContactGuid,
          ContactId: res.ContactId,
          AccountGuid: res.AccountGuid,
          AccountId: res.AccountId,
          GroupCount: res.GroupCount,
          GroupList: GroupList,
          LabelList: LabelList,
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },



  //'设置'菜单隐藏
  clickToSet: function (e) {
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
  gotoGroup: function () {
    wx.navigateTo({
      url: '../ins_group/ins_group'
    })
  },

  /* 设置单独仪器分组 */
  setGroup: function (e) {
    var sn = e.currentTarget.dataset.sn;
    console.log(e.currentTarget.dataset.sn);
    wx.navigateTo({
      url: '../set_group/set_group?sn=' + sn
    })
  },
  /* 添加标签 */
  addLabel: function (e) {
    var sn = e.currentTarget.dataset.sn;
    wx.navigateTo({
      url: '../add_label/add_label?sn=' + sn
    })
  },


  /* 修改备注 remark */
  confirmRemark: function () {
    console.log(this.data.inputValue)
    var that = this;
    util.NetRequest({
      url: 'site-mini/edit-remark',
      data: {
        'Remark': this.data.inputValue != '' ? this.data.inputValue :'无',
        'SerialNo': this.data.remarkSn
      },
      success: function (res) {
        console.log(res)
        if (res.result) {
          var instrumentlist = that.data.AllInstrument;
          for (var i in instrumentlist) {
            if (instrumentlist[i].SerialNo == that.data.remarkSn) {
              instrumentlist[i].Remark = that.data.inputValue != '' ? that.data.inputValue : '无';
            }
          }
          that.setData({
            AllInstrument: instrumentlist,
            //InstrumentList: instrumentlist
          })
        }
        that.setData({
          popup: !that.data.popup
        })
        that.submitfilter();
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
  clearRemark: function(){
    console.log('clear');
    this.setData({
      remarkCon:'',
      inputValue:'',
    })
  },
  Popup: function (e) {
    var remarkSn = e.currentTarget.dataset.sn
    var popup = this.data.popup
    this.setData({
      popup: !popup,
      remarkSn: remarkSn,
      remarkCon: e.currentTarget.dataset.remark
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
    console.log(sn + pi);
    var InstrumentList = this.data.AllInstrument;
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
              if (res.success) {
                for (var i in InstrumentList) {
                  if (InstrumentList[i].SerialNo == sn) {
                    InstrumentList.splice(i, 1)
                  }
                  // if (InstrumentList[i].idx > idx) {
                  //   InstrumentList[i].idx -= 1;
                  // }
                }
                var InstrumentCount = that.data.InstrumentCount;
                that.setData({
                  InstrumentCount: InstrumentCount - 1,
                  AllInstrument: InstrumentList,
                  InstrumentList: InstrumentList,
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

  /* 更多仪器分组 */
  moreGroup: function () {
    this.setData({
      showMoreGroup: !this.data.showMoreGroup
    })
  },

  /* 筛选 */
  clickfilter: function () {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  /* 筛选仪器分组 */
  filterGroup: function (e) {
    var selectGroup = e.currentTarget.dataset.id;
    this.setData({
      filterActive: true,
      selectGroup: selectGroup
    })
    console.log(selectGroup)
    var GroupList = this.data.GroupList;
    for (var i in GroupList) {
      if (e.currentTarget.dataset.idx == i) {
        GroupList[i].filterActive = true;
      } else {
        GroupList[i].filterActive = false
      }
    }
    this.setData(this.data);
    console.log(GroupList)
  },
  allGroup: function (e) {
    var GroupList = this.data.GroupList;
    for (var i in GroupList) {
      GroupList[i].filterActive = false;
    }
    this.setData({
      //filterActive: !this.data.filterActive,
      filterActive: false,
      GroupList: GroupList,
      selectGroup: '',
    })
  },

  /* 筛选仪器标签 */
  filterLabel: function (e) {
    var selectLabel = e.currentTarget.dataset.labelname;
    this.setData({
      //filterActive: true,
      selectLabel: selectLabel
    })
    console.log(selectLabel)
    var LabelList = this.data.LabelList;
    for (var i in LabelList) {
      if (e.currentTarget.dataset.idx == i) {
        LabelList[i].filterActive = true;
      } else {
        LabelList[i].filterActive = false
      }
    }
    this.setData(this.data);
  },

  /* 确定并筛选 */
  submitfilter: function () {
    console.log('begin to filter')
    var str = JSON.stringify(this.data.AllInstrument); //序列化对象
    var InstrumentList = JSON.parse(str); //还原

    //var instrumentList = this.data.InstrumentList;
    var selectGroup = this.data.selectGroup;
    var selectLabel = this.data.selectLabel;
    var filterList = InstrumentList;
    for (var i = 0; i < filterList.length; i++) {
      if (selectGroup != '' && InstrumentList[i].GroupID != selectGroup) {
        filterList.splice(i, 1);
        i--;
      }
    }

    if (selectLabel != '不限') {
      for (var i=0;i<filterList.length;i++) {
        var delLabel = true;
        for (var j in filterList[i].LabelList) {
          if (InstrumentList[i].LabelList[j].LabelName == selectLabel) {
            delLabel = false;
          }
        }

        if (delLabel) {
          filterList.splice(i, 1);
          i--;
        }
      }
    }

    var searchCon = this.data.searchValue;
    var searchWord = searchCon;
    if (searchCon!=''){
      for (var i = 0; i < filterList.length; i++) {
        console.log(filterList[i])
        if (filterList[i].SerialNo.indexOf(searchWord) < 0 && filterList[i].ProductId.indexOf(searchWord) < 0 && filterList[i].ProductDesc.indexOf(searchWord) < 0){
          filterList.splice(i, 1);
          i--;
        }
      }
    }


    this.setData({
      InstrumentList: filterList,
      InstrumentCount: filterList.length
    })
    this.setData({
      showFilter: false
    })
    console.log('finish filter')
  },

  /* 搜索 */
  bindSearchInput: function(e){
    this.setData({
      searchValue: e.detail.value,
    })
  },
  Search: function(){
    this.setData({
      searchShow: !this.data.searchShow,
      searchValue:''
    }) 
  },
  gotoSearch: function () {
    this.setData({
      searchShow: false,
      searchCon: this.data.searchValue
    }) 
  },
  // gotoSearch: function(){
  //   var allInstrument = this.data.AllInstrument;
  //   var searchList = [];
  //   var searchCon = this.data.searchValue;
  //   var reg = new RegExp(searchCon)
  //   if (searchCon!=''){
  //     for (var i in allInstrument) {
  //       if (allInstrument[i].SerialNo.match(reg) || allInstrument[i].ProductId.match(reg) || allInstrument[i].ProductDesc.match(reg)) {
  //         searchList.push(allInstrument[i]);
  //       }
  //     }
  //     this.setData({
  //       InstrumentCount: searchList.length,
  //       InstrumentList: searchList,
  //       lastSearch: '上次搜索：' + this.data.searchValue,
  //       searched: true,
  //       searchValue: '',
  //     })
  //   }else{
  //     this.setData({
  //       InstrumentCount: allInstrument.length,
  //       InstrumentList: allInstrument,
  //       searchValue: '',
  //       searched: false,
  //       lastSearch:'',
  //     })
  //   }
    
  //   this.setData({
  //     searchShow: false,
  //     showFilter: false
  //   }) 
  // },

  backHome: function () {
    util.backHome()
  },
})  