// pages/add_label/add_label.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectColor:'',
    insGroup: [
      { name: 'GC1', colorName: 'yellow', value: 'GC实验仪器一', checked: 'true' },
      { name: 'GC2', colorName: 'coffee', value: 'GC实验仪器二' },
      { name: 'GC3', colorName: 'green', value: 'GC实验仪器三' },
    ],
    /* 弹框 */
    popup: false,
    colorList: [
      { 
        colorName: 'yellow',
        colorActive: false,
       },
      { colorName: 'coffee',
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
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /* 新建分组 */
  showPopup: function () {
    this.setData({
      popup: true,
    })
  },
  hidePopup: function () {
    this.setData({
      popup: false,
    })
  },
  confirmPopup: function () {
    var that = this;
    that.hidePopup()
  },



  /* chooseLabelColor */
  chooseColor: function(event){
    for (var i = 0; i < this.data.colorList.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.colorList[i].colorActive = true
        this.data.selectColor = this.data.colorList[i].colorName
      }
      else {
        this.data.colorList[i].colorActive = false
      }
    }
    this.setData(this.data)
  },



  /* 暂不添加 */
  nolabel: function () {
    wx.navigateTo({
      url: '/new_instrument/new_instrument'
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