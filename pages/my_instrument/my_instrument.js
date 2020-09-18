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
    GroupCount: '',
    remarkCon: '',
    /* 搜索弹框 */
    searchShow: false,
    searched: false,
    searchValue: '',
    inputValue: '',
    remarkId: ''
  },
  backHome: function() {
    util.backHome()
  },





  onLoad: function() {
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    newIns.init();
    //腾讯mta统计结束

    mobile = wx.getStorageSync(mobile);
    console.log('mobile=======' + mobile)

  },

  onShow: function() {
    var that = this;
    util.NetRequest({
      url: 'api/v1/instrument/list',//site-mini/my-instrument
      data: {},
      method:"GET",
      success: function(res) {
        console.log('api/v1/instrument/list:',res)
        that.setData({
          displayState: true,
        })

        var oldinstrumentlist = res.data.list;//InstrumentList
        var instrumentList = [];
        for (var i in oldinstrumentlist) {
          oldinstrumentlist[i].setMask = false;//设置菜单是否展开
          oldinstrumentlist[i].idx = i;
          instrumentList.push(oldinstrumentlist[i]);
        }      
        var gl = res.data.GroupList;
        var GroupList = [];
        for (var i in gl) {
          gl[i].filterActive = false;
          gl[i].idx = i;
          GroupList.push(gl[i]);
        }

        var tempLabelList = res.data.LabelList;
        var LabelList = [];
        var object = {
          id: '',
          labelName: '不限',
          labelColor: '',
          filterActive: true,
          idx: 0,
          labelView: false,
        }
        LabelList.unshift(object);
        for (var i in tempLabelList) {
          tempLabelList[i].filterActive = false;
          tempLabelList[i].idx = parseInt(i) + 1;
          tempLabelList[i].labelView = true;
          LabelList.push(tempLabelList[i]);
        }

        that.setData({
          InstrumentCount: res.data.InstrumentCount,
          InstrumentList: instrumentList,
          AllInstrument: instrumentList,
          GroupCount: res.data.GroupCount,
          GroupList: GroupList,//仪器筛选仪器分组
          LabelList: LabelList,//仪器筛选标签分组
        })
        console.log('instrumentList:',instrumentList);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },



  //'设置'菜单隐藏
  clickToSet: function(e) {
    for (var i = 0; i < this.data.InstrumentList.length; i++) {
      if (e.currentTarget.dataset.idx == i) {
        this.data.InstrumentList[i].setMask = true
      } else {
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
  setGroup: function(e) {
    var sn = e.currentTarget.dataset.sn;
    console.log(e.currentTarget.dataset.sn);
    wx.navigateTo({
      url: '../set_group/set_group?sn=' + sn
    })
  },
  /* 添加标签 */
  addLabel: function(e) {
    var sn = e.currentTarget.dataset.sn;
    wx.navigateTo({
      url: '../add_label/add_label?sn=' + sn
    })
  },


  /* 修改备注 remark */
  confirmRemark: function(e) {
    console.log(this.data.inputValue)
    console.log('修改备注 remark:',this.data.remarkId)
    var that = this;
    util.NetRequest({
      url: 'api/v1/instrument/'+this.data.remarkId,//site-mini/edit-remark
      method:"PUT",
      data: {
        'remark': this.data.inputValue != '' ? this.data.inputValue : '无'
        // 'SerialNo': this.data.remarkSn
      },
      success: function(res) {
        console.log(res)
        if (res.status) {
          var tempinstrumentlist = that.data.AllInstrument;
          for (var i in tempinstrumentlist) {
            if (tempinstrumentlist[i].id == that.data.remarkId) {
              tempinstrumentlist[i].remark = that.data.inputValue != '' ? that.data.inputValue : '无';
            }
          }
          that.setData({
            AllInstrument: tempinstrumentlist,
            //InstrumentList: instrumentlist
          })
        } else {
          wx.showModal({
            title: '修改失败',
            content: '服务器错误，请重新尝试',
            showCancel: false,
            success: function(res) {}
          })
        }
        that.setData({
          popup: !that.data.popup
        })
        that.submitfilter();
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  bindKeyInput: function(e) {
    console.log(e);
    this.setData({
      inputValue: e.detail.value,
    })
  },
  clearRemark: function() {
    console.log('clear');
    this.setData({
      remarkCon: '',
      inputValue: '',
    })
  },
  Popup: function(e) {
    console.log('POPOPOPOPOPOP');
    console.log(e.currentTarget.dataset.id);
    var popup = this.data.popup
    this.setData({
      popup: !popup,
      remarkId: e.currentTarget.dataset.id
    })
  },

  //报修历史
  clickToNext: function(event) {
    var sn = event.currentTarget.dataset.sn;
    var that = this;
    this.setData({
      'sn': sn
    })
    var that = this;
    util.NetRequest({
      url: 'api/v1/sr/history',//sr/history
      method:'GET',
      success: function(res) {
        if (res.data.history_list.length>0) {
          wx.navigateTo({
            url: '../service_list/service_list?sn=' + sn + '&contactId=' + that.data.ContactId,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '该仪器三个月内无报修记录',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      fail: function(err) {
        console.log(err);
      }
    });
  },

  //报修
  clickToRepair: function(event) {
    var sn = event.currentTarget.dataset.sn;
    util.NetRequest({
      url: 'api/v1/instrument/check',//sr/sr-confirm
      data: {
        // contact_guid: this.data.ContactGuid,
        // contact_id: this.data.ContactId,
        // account_guid: this.data.AccountGuid,
        // account_id: this.data.AccountId,
        sn: sn
      },
      success: function(res) {
        console.log(res);
        if (res.status == true) {
          wx.redirectTo({
            url: '../confirm_info/confirm_info' + '?id=' + res.data.id+"&aglNum=" + res.data.AglSN + '&CanRepair=' + res.data.canRepair + '&group=' + JSON.stringify(res.data.group),
          })
          // wx.redirectTo({
          //   url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName + "&needChat=1" + '&CanRepair=' + res.CanRepair + '&group=' + JSON.stringify(res.group),
          // })
        } else {
          wx.showModal({
            title: '连接失败',
            content: '服务器错误，请重新尝试',
            showCancel: false,
            success: function(res) {}
          })
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },

  //添加仪器
  clickToAdd: function() {
    util.chen_navigateTo('pages/serial_number/serial_number', '../serial_number/serial_number?mobile=' + mobile);
  },

  //删除仪器
  clickToRemove: function(event) {
    var that = this
    var id = event.currentTarget.dataset.id;
    var pi = event.currentTarget.dataset.pi;
    var idx = event.currentTarget.dataset.idx;
    var InstrumentList = this.data.AllInstrument;
    wx.showModal({
      title: '提示',
      content: '确定要删除么',
      success: function(res) {
        if (res.confirm) {
          util.NetRequest({
            url: 'api/v1/instrument/'+id,//sr/delete-instrument
            method:"DELETE",
            data: {
              // 'SerialNo': sn,
              // 'ProductId': pi,
            },
            success: function(res) {
              console.log(res);
              if (res.status) {
                for (var i in InstrumentList) {
                  if (InstrumentList[i].id == id) {
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

                that.submitfilter();
                console.log('用户点击确定');
              } else {
                wx.showModal({
                  title: '删除失败',
                  content: '服务器错误，请重新尝试',
                  showCancel: false,
                  success: function(res) {}
                })
              }

            },
            fail: function(err) {
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
      },
    })

  },

  /* 更多仪器分组 */
  moreGroup: function() {
    this.setData({
      showMoreGroup: !this.data.showMoreGroup
    })
  },

  /* 筛选 */
  clickfilter: function() {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  /* 筛选仪器分组 */
  filterGroup: function(e) {
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
  allGroup: function(e) {
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
  filterLabel: function(e) {
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
  submitfilter: function() {
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
      for (var i = 0; i < filterList.length; i++) {
        var delLabel = true;
        for (var j in filterList[i].LabelList) {
          if (InstrumentList[i].LabelList[j].labelName == selectLabel) {
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
    if (searchCon != '') {
      for (var i = 0; i < filterList.length; i++) {
        console.log(filterList[i])
        if (filterList[i].SerialNo.indexOf(searchWord) < 0 && filterList[i].ProductId.indexOf(searchWord) < 0 && filterList[i].ProductDesc.indexOf(searchWord) < 0) {
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
  bindSearchInput: function(e) {
    this.setData({
      searchValue: e.detail.value,
    })
  },
  Search: function() {
    this.setData({
      searchShow: !this.data.searchShow,
      searchValue: ''
    })
  },
  gotoSearch: function() {
    this.setData({
      searchShow: false,
      searchCon: this.data.searchValue
    })
  },


  backHome: function() {
    util.backHome()
  },
})
