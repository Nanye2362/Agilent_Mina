// pages/add_label/add_label.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectColor: '',
    // insGroup: [
    //   { name: 'GC1', colorName: 'yellow', value: 'GC实验仪器一'},
    //   { name: 'GC2', colorName: 'coffee', value: 'GC实验仪器二' },
    //   { name: 'GC3', colorName: 'green', value: 'GC实验仪器三' },
    // ],
    /* 弹框 */
    popup: false,
    colorList: [
      {
        colorName: 'yellow',
        colorActive: false,
      },
      {
        colorName: 'coffee',
        colorActive: false,
      },
      {
        colorName: 'green',
        colorActive: false,
      },
      {
        colorName: 'purple',
        colorActive: false,

      },
      {
        colorName: 'pink',
        colorActive: false,
      },
      {
        colorName: 'orange',
        colorActive: false,
      },
      {
        colorName: 'grass',
        colorActive: false,
      },
      {
        colorName: 'blue',
        colorActive: false,
      },
      {
        colorName: 'red',
        colorActive: false,
      },
      {
        colorName: 'grey',
        colorActive: false,
      },
    ],
    selectLabel: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sn: options.sn,
    })



  },

  /* 新建标签名称input */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  /* 新建标签 */
  Popup: function () {
    var popup = this.data.popup
    this.setData({
      popup: !popup,
    })
  },
  /* 跳转编辑标签 */
  gotoLabelList: function () {
    wx.navigateTo({
      url: '../edit_label/edit_label'
    })
  },


  /* 确认添加标签 */
  confirmAddLabel: function () {
    var that = this;
    console.log(that.data.inputValue)
    util.NetRequest({
      url: 'site-mini/create-label',
      data: {
        'LabelName': that.data.inputValue,
        'LabelColor': that.data.LabelColor
      },
      success: function (res) {
        console.log(res);
        var ll = that.data.LabelList.concat(res.CurrentLabel);
        console.log(ll)
        that.setData({
          LabelList: ll
        })
        
      },
      fail: function (err) {
        console.log(err);
      }
    })
    that.Popup()
  },

  /* 选择标签 */
  /* 多选 */
  checkboxChange: function (e) {
    var that = this;
    console.log(e.detail.value)
    var sl = e.detail.value
    if (sl.length <= 3) {
      this.setData({
        selectLabel: sl.toString()
      })
    } else {
      for (var i = 0; i < that.data.LabelList.length; i++) {
        if (e.currentTarget.dataset.idx == i) {
          that.data.LabelList[i].checked = false;
        }
      }
      that.setData(that.data);
      sl.pop();
      console.log(sl)
      that.setData({
        selectLabel: sl.toString()
      })
      wx.showModal({
        title: '提示',
        content: '标签的数量不能大于3个',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },



  /* chooseLabelColor */
  chooseColor: function (e) {
    for (var i = 0; i < this.data.colorList.length; i++) {
      if (e.currentTarget.id == i) {
        this.data.colorList[i].colorActive = true
        this.data.selectColor = this.data.colorList[i].colorName
      }
      else {
        this.data.colorList[i].colorActive = false
      }
    }

    this.setData(this.data)
    console.log(e.currentTarget.dataset.colorname)
    this.setData({
      LabelColor: e.currentTarget.dataset.colorname
    })
  },



  /* 暂不添加 */
  nolabel: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /* 确认提交 */
  submit: function () {
    util.NetRequest({
      url: 'site-mini/set-label',
      data: {
        'ID': this.data.selectLabel,
        'SerialNo': this.data.sn,
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
    var that = this;
    var selectLabel=[];
    util.NetRequest({
      url: 'site-mini/show-label',
      data: {
        'SerialNo': this.data.sn
      },
      success: function (res) {
        console.log(res.LabelList)
        var labelList = res.LabelList
        var LabelList = [];
        for (var i in labelList) {
          labelList[i].idx = i;
          LabelList.push(labelList[i]);
          if (LabelList[i].Checked){
            selectLabel.push(LabelList[i].ID);
          }
        }
        that.setData({
          LabelList: LabelList,
          selectLabel: selectLabel.toString()
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
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