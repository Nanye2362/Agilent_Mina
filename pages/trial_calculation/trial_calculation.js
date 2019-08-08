import uCharts from '../../Data/u-charts.min.js';
var _self;
var canvaColumn = null;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cWidth: '',
      cHeight: '',
      categories:["12月","24月", "36月", "48月", "60月"],
      series:[{
          "name": "融资租赁方案月供金额",
          "data": [{"value": 0,"color": "#064369"},{"value": 0,"color": "#064369"}, {"value": 0,"color": "#064369"}, {"value": 0,"color": "#064369"}, {"value": 0,"color": "#064369"}]
      }],
      inputVal:'',
      inputVal1:'',
      isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
console.log(app.globalData.sysInfo.winWidth);
      console.log(app.globalData.sysInfo.winHeight * 500 / 750);
      _self=this;
      this.setData({
          cWidth:app.globalData.sysInfo.winWidth,
          cHeight:500 / 750 * app.globalData.sysInfo.winHeight,
      });
      this.getServerData();
  },
    getServerData: function() {
        let Column = { categories: [], series: [] };
        Column.categories = this.data.categories;
        Column.series = this.data.series;

        _self.showColumn("canvasColumn", Column);
    },
    showColumn(canvasId, chartData) {
        canvaColumn = new uCharts({
            $this: _self,
            canvasId: canvasId,
            type: 'column',
            legend: true,
            fontSize: 11,
            background: '#FFFFFF',
            colors:['#064369'],
            pixelRatio: 1,
            animation: true,
            categories: chartData.categories,
            series: chartData.series,
            xAxis: {
                disableGrid: true,
            },
            yAxis: {
                //disabled:true
                format:function (e) {
                    return e.toFixed(0) +'元'
                },
                splitNumber:3,
            },
            dataLabel: true,
            width: app.globalData.sysInfo.winWidth * 0.92,
            height:  app.globalData.sysInfo.winWidth * 0.92 * (400 / 750),
            extra: {
                column: {
                    type: 'group',
                    width: 10
                }
            }
        });

    },
    touchColumn(e) {
        canvaColumn.showToolTip(e, {
            format: function (item, category) {
                if (typeof item.data === 'object') {
                    return category + ' ' + item.name + ':' + item.data.value
                } else {
                    return category + ' ' + item.name + ':' + item.data
                }
            }
        });
    },
    bindValInput:function(e){ //绑定输入框中的值
      this.setData({
          'inputVal':e.detail.value
      });
    },
    clickTrial:function(){ //试算

      if(this.data.inputVal >= 9900){
          wx.showModal({
              title: '提示',
              content: '输入金额超过上限',
              showCancel:false,
              success (res) {
                  if (res.confirm) {
                      console.log('用户点击确定')
                  } else if (res.cancel) {
                      console.log('用户点击取消')
                  }
              }
          })
            return false;
      }
        var rate = 0;
        if(this.data.inputVal <= 25){
            rate = 0.115;
        }else if(this.data.inputVal <= 9900){
            rate = 0.11;
        }
        var total = this.data.inputVal  * (1 + rate) * 10000;

        var series1 = this.data.series;

        for (var i = 0; i < 5; i++) { //对应12月到60月5档
            var perMonth = total / ((i + 1)*12);
            series1[0].data[i].value = perMonth.toFixed(0);
        }

        this.setData({
            isShow:true,
            series:series1,
            inputVal1:this.data.inputVal
        });
        this.getServerData();
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
