// pages/evaluate/evaluate.js
var initData = {
  //评论计数
  describeNo: "0",
  stars:[],
  averageList:[],
  averageNum:0,
  drawAverageStars: [{
    count: 0,
    src: 'star_0'
  }, {
    count: 1,
    src: 'star_0'
  }, {
    count: 2,
    src: 'star_0'
  }, {
    count: 3,
    src: 'star_0'
  }, {
    count: 4,
    src: 'star_0'
  }]
}
var arrTitle = ["流程顺畅", "技术能力", "响应速度", "服务态度", "着装工整","服务进度更新"];

for (var i = 0; i < 5; i++) {
  var tempObj = {
  title: arrTitle[i],
  currentCount:0,
  data:[{
    count: 0,
    src: 'star_0'
  }, {
    count: 1,
    src: 'star_0'
  }, {
    count: 2,
    src: 'star_0'
  }, {
    count: 3,
    src: 'star_0'
  }, {
    count: 4,
    src: 'star_0'
  }]
  }
  initData.stars.push(tempObj);
} 


Page({
  /**
   * 页面的初始数据
   */
  data: initData,
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  //星星评价
  markStarSelect: function (e) {
    var that = this

    var num = Number(e.currentTarget.id) + 1
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var arr = []

    for (var k in that.data.stars) {
      var obj = {}
      if (k < num) {
        obj.count = that.data.stars[k].count
        obj.src = 'star_1'
        arr.push(obj);
      } else {
        obj.count = that.data.stars[k].count
        obj.src = 'star_0'
        arr.push(obj);
      }
    }

    var thisstars=that.data.stars;
    console.log(thisstars[index]);
    thisstars[index].currentCount = num;
    thisstars[index].data = arr;
    that.setData({
      stars: thisstars,
    })
    var averageNum = this.averageCalculate();
    that.setData({
      averageNum: averageNum,
    })
    this.drawAverageStars(averageNum);
  },

  //反馈textarea
  desNo: function (e) {
    this.setData({ describeNo: (e.detail.value).length });
  },

  //平均值星星渲染
  drawAverageStars: function(averNum){
    var num = parseInt(averNum);
    var remainder = (averNum - num);
    var drawAverageStars = this.data.drawAverageStars;
    for (var k in drawAverageStars) {
      if (drawAverageStars[k].count < num) {
        drawAverageStars[k].src = 'star_1'
      } else {
        drawAverageStars[k].src = 'star_0';
      }
    }
    if (remainder) {
      drawAverageStars[num].src = 'star_half'
    }

    this.setData({
      drawAverageStars: drawAverageStars
    })
  },

  //平均值计算
  averageCalculate: function(){
        var averageArr = [];
        var sum = 0;
        var starsInfo = this.data.stars;
        var averageNum = 0;
        for (var i = 0; i < starsInfo.length; i++){
          console.log(starsInfo[i].currentCount)
          var grade = starsInfo[i].currentCount;
          if (grade != 0){
            averageArr.push(grade);
          }
          sum+=Number(grade);
        }
        averageNum = (sum/(averageArr.length)).toFixed(2);
        return averageNum;
    }
  
})