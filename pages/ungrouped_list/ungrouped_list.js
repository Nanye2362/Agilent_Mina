// pages/ungrouped_list/ungrouped_list.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // detailList: [
    //   { name: 'USA', value: '美国' },
    //   { name: 'CHN', value: '中国' },
    // ],
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

    var that = this;
    util.NetRequest({
      url: 'site-mini/ungrouped-list',
      data: {
      },
      success: function (res) {
        console.log(res.data.DetailList)
        var detaillist = res.data.DetailList;
        var DetailList = [];
        for (var i in detaillist) {
          detaillist[i].GroupID = that.data.GroupID;
          DetailList.push(detaillist[i]);
        }
        that.setData({
          detailList: DetailList,
          ListCount: DetailList.length
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },


  /* 多选 */
  checkboxChange: function (e) {
    console.log(e.detail.value.toString())
    this.setData({
      selectSN: e.detail.value.toString()
    })
  },


  /* 确认添加 */
  submit: function(){
    util.NetRequest({
      url: 'site-mini/set-group',
      data: {
        GroupName: this.data.GroupName,
        GroupID: this.data.GroupID,
        SerialNoList: this.data.selectSN
      },
      success: function (res) {
        console.log(res);
        wx.navigateBack({
          delta: 1
        })
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