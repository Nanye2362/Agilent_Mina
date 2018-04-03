// pages/edit_label/edit_label.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    lastLabel:'',
    lastColor:'',
    inputValue:'',
    LabelColor:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    util.NetRequest({
      url: 'site-mini/show-label',
      data: {
      },
      success: function (res) {
        console.log(res.LabelList)
        var labelList = res.LabelList
        var LabelList = [];
        for (var i in labelList) {
          labelList[i].idx = i;
          labelList[i].deleted = true;
          labelList[i].editting = false;
          LabelList.push(labelList[i]);
        }
        that.setData({
          LabelList: LabelList
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  /* 删除标签 */
  delGroup: function(e){
    var that = this
    var ID = e.currentTarget.dataset.id
    console.log(ID)
    console.log(that.data.LabelList)
    that.setData({
      ID: ID
    })
    wx.showModal({
      title: '提示',
      content: '确定删除该标签？',
      success: function (res) {
        if (res.confirm) {       
          util.NetRequest({
            url: 'site-mini/del-label',
            data: {
              'ID': ID
            },
            success: function (res) {
              console.log(res)
              if (res.result) {
                var labelList = that.data.LabelList;
                console.log(labelList)
                for(var i =0;i<labelList.length;i++){
                  if (labelList[i].ID == that.data.ID) {
                    labelList.splice(i, 1)
                  }
                  //i--;
                }
                console.log(labelList);
                that.setData({
                  LabelList: labelList
                })
              }
            },
            fail: function (err) {
              console.log(err);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },


  /* 修改标签 */
  Popup: function (e) {
    var eID = e.currentTarget.dataset.id
    var popup = this.data.popup
    var labelname = e.currentTarget.dataset.labelname
    var lastcolor = e.currentTarget.dataset.labelcolor
    this.setData({
      popup: !popup,
      eID : eID,
      lastLabel: labelname, 
      lastColor: lastcolor,
      inputValue:''  
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
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


  /* 确认修改标签 */
  confirmAddLabel: function () {
    var that = this;
    console.log(that.data.inputValue)
    util.NetRequest({
      url: 'site-mini/edit-label',
      data: {
        'LabelName': that.data.inputValue != '' ? that.data.inputValue: that.data.lastLabel,
        'LabelColor': that.data.LabelColor != '' ? that.data.LabelColor : that.data.lastColor,
        'ID': that.data.eID
      },
      success: function (res) {
        console.log(res);
        if(res.result){
          var labelList = that.data.LabelList;
          for (var i in labelList) {
            if (labelList[i].ID == that.data.eID) {
              labelList[i].LabelName = that.data.inputValue != '' ? that.data.inputValue : that.data.lastLabel;
              labelList[i].LabelColor = that.data.LabelColor != '' ? that.data.LabelColor : that.data.lastColor;
            }
          }
          console.log(labelList);
          that.setData({
            LabelList: labelList
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
    that.setData({
      popup: !that.data.popup
    })
    //that.Popup()
  },



  /* 确定 */
  submit: function(){
    wx.navigateBack({
      delta: 1
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