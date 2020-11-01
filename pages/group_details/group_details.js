var util = require('../../utils/util.js');
var app = getApp()
// pages/group_details/group_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setMask: false,
    addConfirm: false,
    popup: false,
    remarkCon: '',
    remarkId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      GroupName: options.GroupName,
      GroupID: options.GroupID,
    })
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function (options) {
    var that = this;
    util.NetRequest({
      url: 'api/v1/instrument/groups/'+that.data.GroupID+'/details',//site-mini/group-details
      method:'GET',
      success: function (res) {
        console.log('group-details:',res.data.DetailList)
        var detaillist = res.data.DetailList;
        var DetailList = [];
        for (var i in detaillist) {
          detaillist[i].setMask = false;
          detaillist[i].idx = i;
          detaillist[i].GroupID = that.data.GroupID;
          DetailList.push(detaillist[i]);
        }
        that.setData({
          detailList: DetailList,
          ListCount: res.data.ListCount,
          // ContactGuid: res.data.ContactGuid,
          // ContactId: res.data.ContactId,
          // AccountGuid: res.data.AccountGuid,
          // AccountId: res.data.AccountId,
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  /* 确认添加分组 */
  clickToConfirm: function() {
    this.setData({
      addConfirm: false,
    })
  },



  /* 添加序列号 */
  clickToAdd: function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['从当前序列号添加', '扫描添加新序列号'],
      itemColor: '#0085d5',
      success: function (res) {       
        console.log(res.tapIndex)
        if(res.tapIndex === 0){
          var GroupName = that.data.GroupName;
          var GroupID = that.data.GroupID;
          wx.navigateTo({
            //url: '../serial_number/serial_number?mobile=' + mobile,
            url: '../ungrouped_list/ungrouped_list?GroupName=' + GroupName + '&GroupID=' + GroupID
          })
        } else if ( res.tapIndex === 1 ){
          wx.navigateTo({
            //url: '../serial_number/serial_number?mobile=' + mobile,
            url: '../serial_number/serial_number?GroupID=' + that.data.GroupID
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
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


  /* 修改备注 */
  confirmRemark: function () {
    var that = this;
    util.NetRequest({
      url: 'api/v1/instrument/'+this.data.remarkId,//site-mini/edit-remark
      method:"PUT",
      data: {
        'remark': this.data.inputValue != '' ? this.data.inputValue : '无',
        // 'SerialNo': this.data.remarkSn
      },
      success: function (res) {
        console.log(res)
        if (res.status) {
          var detaillist = that.data.detailList;
          for (var i in detaillist) {
            if (detaillist[i].SerialNo == that.data.remarkSn) {
              detaillist[i].Remark = that.data.inputValue != '' ? that.data.inputValue : '无';
            }
            
          }
          that.setData({
            detailList: detaillist,
          })
        }else{
          wx.showModal({
            title: '修改失败',
            content: '服务器错误，请重新尝试',
            showCancel: false,
            success: function (res) {
            }
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
    console.log(e.currentTarget.dataset.id);
    var popup = this.data.popup
    this.setData({
      popup: !popup,
      remarkSn: remarkSn,
      remarkCon: e.currentTarget.dataset.remark,
      remarkId: e.currentTarget.dataset.id
    })
  }, 
  clearRemark: function () {
    console.log('clear');
    this.setData({
      remarkCon: '',
      inputValue: '',
    })
  },


  //报修历史
  clickToNext: function (event) {
    var sn = event.currentTarget.dataset.sn;
    this.setData({ 'sn': sn })
    var that = this;
    util.NetRequest({
      url: 'api/v1/sr/history',//sr/history
      method:'GET',
      success: function (res) {
        if (res.data.history_list.length>0) {
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
      url: 'api/v1/instrument/check',//sr/sr-confirm?needChat=1
      data: {
        // contact_guid: this.data.ContactGuid,
        // contact_id: this.data.ContactId,
        // account_guid: this.data.AccountGuid,
        // account_id: this.data.AccountId,
        sn: sn
      },
      success: function (res) {
        console.log(res);
        if (res.status == true) {
          wx.redirectTo({
            url: '../confirm_info/confirm_info' + '?id=' + res.data.id+"&aglNum=" + res.data.AglSN + '&CanRepair=' + res.data.canRepair + '&group=' + JSON.stringify(res.data.group) + '&needChat=1',
          })
          // wx.redirectTo({
          //   url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName,
          // })
        }else{
          wx.showModal({
            title: '连接失败',
            content: '服务器错误，请重新尝试',
            showCancel: false,
            success: function (res) {
            }
          })
        }
      },
      fail: function(err){
        console.log(err);
      }
    })
  },


  //删除仪器
  clickToRemove: function (event) {
    var that = this
    var id = event.currentTarget.dataset.id;
    var pi = event.currentTarget.dataset.pi;
    var idx = event.currentTarget.dataset.idx;

    var detailList = this.data.detailList;
    wx.showModal({
      title: '提示',
      content: '确定要删除么',
      success: function (res) {
        if (res.confirm) {
          util.NetRequest({
            url: 'api/v1/instrument/'+id,//sr/delete-instrument
            method:"DELETE",
            data: {
              // 'SerialNo': sn,
              // 'ProductId': pi,
            },
            success: function (res) {
              console.log(res);
              if (res.status) {
                for (var i in detailList) {
                  if (detailList[i].id == id) {
                    detailList.splice(i, 1)
                  }
                }
                var ListCount = that.data.ListCount;
                that.setData({
                  ListCount: ListCount - 1,
                  detailList: detailList
                })
                console.log('用户点击确定');
              }else{
                wx.showModal({
                  title: '删除失败',
                  content: '服务器错误，请重新尝试',
                  showCancel: false,
                  success: function (res) {
                  }
                })
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


  //'设置'菜单隐藏
  clickToSet: function (e) {
    for (var i = 0; i < this.data.detailList.length; i++) {
      if (e.currentTarget.dataset.idx == i) {
        this.data.detailList[i].setMask = true
      }
      else {
        this.data.detailList[i].setMask = false
      }
    }
    this.setData(this.data)
  },





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  
  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})