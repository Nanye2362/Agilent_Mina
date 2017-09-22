// pages/evaluate/evaluate.js
var util = require('../../utils/util.js');
var initData = {
  //评论计数
  describeNo: "0",
  describe: "",
  stars: [],
  averageList: [],
  averageNum: 0,
  Surveyid: '',
  SerialNo: '',
  arrTitle: [],
  questionSet_result: [],
  QuestionsSet_Comments: {},
  QuestionsSet: [], // 存储评论后的信息
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


Page({
  /**
   * 页面的初始数据
   */
  data: initData,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    this.setData({
      Surveyid: option.Surveyid,
      SerialNo: option.SerialNo,
    })

    util.NetRequest({
      url: 'site-mini/evaluation?survey_id=' + option.Surveyid + '&servicereq_id=' + option.SerialNo,
      success: function (res) {
        console.log(res);
        var questionSet_result = res.QuestionsSet_results;
        var QuestionsSet_Comments = res.QuestionsSet_Comments;
        var questionList = that.sortQuestionDesc(questionSet_result);
        that.setData({
          arrTitle: questionList,
          questionSet_result: questionSet_result,
          QuestionsSet_Comments: QuestionsSet_Comments
        })
        that.sortStarList();
      }
    })
  },

  //生成stars
  sortStarList: function () {
    var arrTitle = this.data.arrTitle;
    var arrTitleL = arrTitle.length;
    var questionSet_result = this.data.questionSet_result;
    var stars = [];
    for (var i = 0; i < arrTitleL; i++) {
      var tempObj = {
        title: arrTitle[i],
        currentCount: 0,
        QuestionId: questionSet_result[i].QuestionId,
        AnswerId: questionSet_result[i].AnswerId,
        QuestionDesc: questionSet_result[i].AnswerId,
        answer_value_id: '',
        ValueSelectedF: false,
        data: [{
          count: 0,
          Valueid: questionSet_result[i].AnswervaluesSet.results[0].Valueid,
          src: 'star_0'
        }, {
          count: 1,
          Valueid: questionSet_result[i].AnswervaluesSet.results[1].Valueid,
          src: 'star_0'
        }, {
          count: 2,
          Valueid: questionSet_result[i].AnswervaluesSet.results[2].Valueid,
          src: 'star_0'
        }, {
          count: 3,
          Valueid: questionSet_result[i].AnswervaluesSet.results[3].Valueid,
          src: 'star_0'
        }, {
          count: 4,
          Valueid: questionSet_result[i].AnswervaluesSet.results[4].Valueid,
          src: 'star_0'
        }]
      }
      stars.push(tempObj);
    }

    this.setData({
      stars: stars
    })
  },
  //提取question_description
  sortQuestionDesc: function (list) {
    var questionList = [];
    for (var i = 0; i < list.length; i++) {
      questionList.push(list[i].QuestionDesc);
    }
    return questionList;
  },

  //星星评价
  markStarSelect: function (e) {
    var that = this
    var num = Number(e.currentTarget.id) + 1;
    var index = e.currentTarget.dataset.index;
    var answerValueID = e.currentTarget.dataset.valueid;
    console.log('here' + answerValueID);
    var arr = []

    for (var k in that.data.stars[index].data) {
      var obj = {}
      if (k < num) {
        obj.count = that.data.stars[index].data[k].count;
        obj.Valueid = that.data.stars[index].data[k].Valueid;
        obj.src = 'star_1';
        arr.push(obj);
      } else {
        obj.count = that.data.stars[index].data[k].count;
        obj.Valueid = that.data.stars[index].data[k].Valueid;
        obj.src = 'star_0';
        arr.push(obj);
      }
    }

    var thisstars = that.data.stars;
    console.log(thisstars[index]);
    thisstars[index].currentCount = num;
    thisstars[index].answer_value_id = answerValueID;
    thisstars[index].ValueSelectedF = true;
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
    console.log(e);
    this.setData({
      describeNo: e.detail.cursor,
      describe: e.detail.value
    });
  },

  //平均值星星渲染
  drawAverageStars: function (averNum) {
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
  averageCalculate: function () {
    var averageArr = [];
    var sum = 0;
    var starsInfo = this.data.stars;
    var averageNum = 0;
    for (var i = 0; i < starsInfo.length; i++) {
      console.log(starsInfo[i].currentCount)
      var grade = starsInfo[i].currentCount;
      if (grade != 0) {
        averageArr.push(grade);
      }
      sum += Number(grade);
    }
    averageNum = (sum / (averageArr.length)).toFixed(2);
    return averageNum;
  },

  //提交评论
  clickToSubmmit: function () {
    var stars = this.data.stars;
    console.log(stars);
    for (var i in stars) {
      if (stars[i].ValueSelectedF == false) {
        wx.showToast({
          title: '评价未完成',
          icon: 'loading',
          duration: 2000
        })
        return false;
      }

    }
    var QuestionsSet = [];
    var questionSet_result = this.data.questionSet_result;
    console.log(questionSet_result);
    var QuestionsSet_Comments = this.data.QuestionsSet_Comments;
    var openID = wx.getStorageSync('OPENID');
    var that = this;
    for (var i = 0; i < questionSet_result.length; i++) {
      var a = {
        "QuestionId": questionSet_result[i].question_id,
        "QuestionDesc": questionSet_result[i].QuestionDesc,
        "AnswerId": questionSet_result[i].AnswerId,
        "AnswervaluesSet": [{
          "AnswerId": questionSet_result[i].AnswerId,
          "Value": stars[i].currentCount + " Star",
          "Valueid": stars[i].answer_value_id,
          "ValueSelected": "X"
        }]
      };
      QuestionsSet.push(a);
    }

    var textarea_answer = {
      "QuestionId": QuestionsSet_Comments.QuestionId,
      "QuestionDesc": QuestionsSet_Comments.QuestionDesc,
      "AnswerId": QuestionsSet_Comments.AnswerId,
      "AnswervaluesSet": [{
        "AnswerId": QuestionsSet_Comments.AnswerId,
        "Value": that.data.describe,
        "Valueid": QuestionsSet_Comments.AnswervaluesSet.results[0].Valueid,
      }]
    };
    QuestionsSet.push(textarea_answer);
    console.log(QuestionsSet);
    var data1 = {
      "SurveyId": that.data.Surveyid,
      "ServicereqId": that.data.SerialNo,
      "SurveyVersion": '',
      "QuestionsSet": QuestionsSet
    }

    var data = JSON.stringify(data1)
    util.NetRequest({
      url: 'sr/submit-evaluation?openid=' + openID,
      data: {
        "d": data,
        "from": 'mini'
      },
      success: function (res) {
        console.log(res);
        if (res.success == true) {
          //提示用户：评价成功
          wx.showModal({
            title: '评价成功',
            content: '感谢您的评价',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          //提示用户：评价失败
          wx.showModal({
            title: '评价失败',
            content: '系统错误，请稍后再试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  },

})