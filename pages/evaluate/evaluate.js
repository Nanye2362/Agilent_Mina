// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //评论计数
    describeNo: "0",
    currentCount: "3",
    stars: [{
      count: 0,
      src: 'star_1'
    }, {
      count: 1,
      src: 'star_1'
    }, {
      count: 2,
      src: 'star_1'
    }, {
      count: 3,
      src: 'star_0'
    }, {
      count: 4,
      src: 'star_0'
    }],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //星星评价
  markStarSelect: function (e) {
    var that = this

    var num = Number(e.currentTarget.id) + 1
    var arr = []

    for (var k in that.data.stars) {
      var obj = {}
      if (k < num) {
        obj.count = that.data.stars[k].count
        obj.src = 'star_1'
        arr.push(obj)
      } else {
        obj.count = that.data.stars[k].count
        obj.src = 'star_0'
        arr.push(obj)
      }
    }

    that.setData({
      currentCount: num,
      stars: arr
    })
  },

  //反馈textarea
  desNo: function (e) {
    this.setData({ describeNo: (e.detail.value).length });
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