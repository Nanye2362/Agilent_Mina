// pages/ins_group/ins_group.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    /* 弹框 */
    popup: false ,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sn: options.sn,
    })

    var that = this;
    util.NetRequest({
      url: 'site-mini/show-group',
      data: {
      },
      success: function (res) {
        console.log(res.GroupList)
        that.setData({
          groupList: res.GroupList
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },


  /* 单选 */
  radioChange: function (e) {
    console.log(e.detail.value)  
    this.setData({
      GroupName: e.detail.value
    })
  },
  clickRadio: function(e){
    var GroupID = e.currentTarget.dataset.id
    console.log(GroupID)
    this.setData({
      GroupID: GroupID
    })
  },


  /* 新建分组 */
  Popup: function(){
    var popup = this.data.popup
    this.setData({
      popup: !popup,
    })
  },


  /* 新建分组名称input */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /* 确认添加分组 */
  confirmPopup: function(){
    var that = this;
    console.log(that.data.inputValue)
    util.NetRequest({
      url: 'site-mini/create-group',
      data: {
        'GroupName' : that.data.inputValue
      },
      success: function (res) {
        console.log(res);
        if(res.CurrentGroup.ID){
          var gl = that.data.groupList.concat(res.CurrentGroup);
          console.log(gl)
          that.setData({
            groupList: gl
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
  },


  /* 暂不分组 */
  nogroup: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  submit: function(){
    util.NetRequest({
      url: 'site-mini/set-group',
      data: {
        'GroupName': this.data.GroupName,
        'SerialNo': this.data.sn,
        'GroupID': this.data.GroupID
      },
      success: function (res) {
        console.log(res);
        if(res.result){
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showModal({
            title: '设置失败',
            content: '服务器错误，请重新尝试',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
        
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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