// pages/ins_group/ins_group.js
var util = require('../../utils/util.js');
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    GroupCount:'',
    popup: false,
    /* 编辑状态 */
    gotoEdit: true,
    editGroup: true,
    /* 编辑数组 */
    delList:[],
    editList:[],
    inputValue:'',
    lastGroupName:'',
    error: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    var that = this 
    util.NetRequest({
      url: 'api/v1/instrument/ins-groups',//site-mini/ins-group
      method:"GET",
      success: function (res) {
        console.log(res)
        var GroupList = [];
        var gl = res.data.GroupList
        for (var i in gl) {
          gl[i].editting = false;
          gl[i].idx = i;
          gl[i].deleted = true;
          GroupList.push(gl[i]);
        }
        console.log(GroupList)
        that.setData({
          GroupCount: res.data.GroupList.length,
          GroupList: GroupList
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },


  /* 编辑 */
  editGroup: function () {
    console.log(this.data.GroupList);
    this.setData({
      gotoEdit: false,
      editGroup: false,
      inputValue:'',
    })
  },

  /* 修改分组名称 */
  bindKeyInput: function(e){ 
    this.setData({
      inputValue: e.detail.value
    })  
  },

  edConfirm: function(e){
    var obj = {};
    obj.GroupName = this.data.inputValue != '' ? this.data.inputValue:this.data.lastGroupName;
    obj.GroupID = e.currentTarget.dataset.id;
    var editlist = this.data.editList
    editlist.push(obj);
    this.setData({
      editList: editlist
    })
    for (var i = 0; i < this.data.GroupList.length; i++) {
      if (e.currentTarget.dataset.idx == i) {
        this.data.GroupList[i].editting = false;
        this.data.GroupList[i].GroupName = this.data.inputValue != '' ? this.data.inputValue : this.data.lastGroupName;
      }
    }
    this.setData(this.data)
  },


  /* 取消编辑分组 */
  cancelGroup: function(){
    this.setData({
      gotoEdit: true,
      editGroup: true,
      delList: [],
      editList: [],
      lastGroupName:'',
      inputValue:'',
    })

  },


  /* 删除分组 */
  delGroup: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该分组？',
      success: function (res) {
        if (res.confirm) {
          var delList = that.data.delList
          delList.push(e.currentTarget.dataset.id)
          that.setData({
            delList: delList
          })
          for (var i = 0; i < that.data.GroupList.length; i++) {
            if (e.currentTarget.dataset.idx == i) {
              that.data.GroupList[i].deleted = false;
            }
          }
          that.setData(that.data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },


  /* 完成编辑 */
  finishGroup: function () {
    var that = this;
    var dl = JSON.stringify(this.data.delList)
    var el = JSON.stringify(this.data.editList)
    this.setData({
      gotoEdit: true,
      editGroup: true,
    })
    util.NetRequest({
      url: 'api/v1/instrument/batch-edit-groups',//site-mini/edit-group
      data: {
        DelList: dl,
        EditList: el
      },
      success: function (res) {
        console.log(res)
        if(res.status){
          util.NetRequest({
            url: 'api/v1/instrument/ins-groups',//site-mini/ins-group
            method:"GET",
            success: function (res) {
              console.log(res);
              var GroupList = [];
              var gl = res.data.GroupList
              for (var i in gl) {
                gl[i].editting = false;
                gl[i].idx = i;
                gl[i].deleted = true;
                GroupList.push(gl[i]);
              }
              that.setData({
                GroupCount: res.data.GroupList.length,
                GroupList: GroupList,
              })
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }else{
          wx.showModal({
            title: '设置失败',
            content: '服务器错误，请重新尝试',
            showCancel: false,
            success: function (res) {
            }
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  /* 具体分组内容 */
  groupDetails: function (e) {
    var GroupID = e.currentTarget.dataset.id;
    var GroupName = e.currentTarget.dataset.gn;
    wx.navigateTo({
      url: '../group_details/group_details?GroupID='+ GroupID+'&GroupName='+GroupName
    })
  },

  

  /* 新建分组 */
  Popup: function () {
    var popup = this.data.popup
    this.setData({
      popup: !popup,
      inputValue:'',
    })
  },

  /* 新建分组名称input */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /* 确认添加分组 */
  confirmPopup: function () {
    var that = this;
    console.log(that.data.inputValue)
    if (that.data.inputValue!=''){
      util.NetRequest({
        url: 'api/v1/instrument/groups',//site-mini/create-group
        data: {
          'GroupName': that.data.inputValue
        },
        success: function (res) {
          console.log(res);
          console.log(that.data.GroupList)
          if(res.data.CurrentGroup.id){
            var curGroup = { id: res.data.CurrentGroup.id, groupName: res.data.CurrentGroup.groupName, GroupSnCount: "0", deleted: true, editting: false, idx: that.data.GroupList.length }
            var gl = that.data.GroupList.concat(curGroup);
            console.log(gl)
            console.log(gl.length)
            that.setData({
              GroupList: gl,
              GroupCount: gl.length
            })
          }else{
            wx.showModal({
              title: '创建失败',
              content: '服务器错误，请重新尝试',
              showCancel: false,
              success: function (res) {
              }
            })
          }
          
        },
        fail: function (err) {
          console.log(err);
        }
      })
      that.Popup()
    }else{
      that.setData({
        error: true,
      })
    }
    
  },


  /* 进入编辑状态 */
  edGroup: function(e){
    for (var i = 0; i < this.data.GroupList.length; i++) {
      if (e.currentTarget.dataset.idx == i) {
        this.data.GroupList[i].editting = true
        console.log(this.data.GroupList[i].GroupName)
        this.setData({
          lastGroupName: this.data.GroupList[i].GroupName
        })
      }
      else {
        this.data.GroupList[i].editting = false
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