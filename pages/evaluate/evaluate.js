// pages/evaluate/evaluate.js
var util = require('../../utils/util.js');
var initData = {
  surveySubmitted: false,
  describeNo: 0,
  averageNum: 0,
  suveryid: '',
  srid: '',
  feedback: {      //textarea单独存储，方便提交评价时验证星星数组长度，必填验证
    value: '',
    valueid: ''
  },
  surveyStar: {}, //绑定元素存储几星 {0：4，1：3}
  surveyResult: {},   //存储选择后的星级选择对象，提交时整理数据顺序
  surveyList: [],   //存储星级问题列表，渲染list
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
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mta统计结束
    var that = this;
    this.setData({
      suveryid: option.Surveyid,
      srid: option.SerialNo,
    })
    that.getSuvery();

  },
  backHome: function () {
    util.backHome()
  },
  // 评价查询
  getSuvery: function () {
    var that = this;
    util.NetRequest({
      url: '/api/v1/sr/suvery?suveryid=' + that.data.suveryid + '&srid=' + that.data.srid,///site-mini/evaluation
      method: "GET",
      success: function (res) {
        console.log('to survey:', res);
        that.data.surveySubmitted = res.data.is_submitted;  
        res.data.survey.forEach((item, index) => {
          if (item.answerStyle === 'Field') {
            that.data.feedback.valueid = item.answervaluesSet.results[0].valueid;
            if (that.data.surveySubmitted === true) {
              that.data.feedback.value = item.answervaluesSet.results[0].value || '';
            }
          } else if (item.answerStyle === 'RadioButton') {
            that.data.surveyList.push(item)
            if (that.data.surveySubmitted === true) {
              //已评价，渲染数据:surveyStar
              that.data.surveyStar[index] = Number(item.answervaluesSet.results[0].value);
              that.getAverageRate();
            } else {
              //未评价，初始化 surveyStar为0
              that.data.surveyStar[index] = 0;
            }
          }
        })
        that.setData({
          surveyList: that.data.surveyList,
          surveyStar: that.data.surveyStar,
          feedback: that.data.feedback,
          surveySubmitted:that.data.surveySubmitted
        })
      }
    })
  },
  //计算总体评分取平均值
  getAverageRate: function () {
    var that = this;
    let num = 0;
    let total = 0;
    for (let i in this.data.surveyStar) {
      if (Number(this.data.surveyStar[i]) != 0) {
        num = num + 1;
        total = Number(total) + Number(this.data.surveyStar[i]);
        that.data.averageNum = Number((total / num).toFixed(1));
      }
    }
    that.setData({
      averageNum: that.data.averageNum,
    })
  },

  //点击评分
  surveyChange(e) {
    //item: 当前问题的列表，index: 第几个问题
    console.log('点击评分:',e);
    var index=e.currentTarget.dataset.id;
    var item=e.currentTarget.dataset.itm;
    var key=e.currentTarget.dataset.key;
    this.data.surveyStar[index]=key;
    this.setData({
      surveyStar: this.data.surveyStar 
     })
    let json = {};
    json.value = this.data.surveyStar[index];
    //查找选择的答案的answerID
    json.valueid = item.results[json.value - 1].valueid;
    this.data.surveyResult[index] = json;
    this.getAverageRate();
  },
  //反馈textarea
  desNo: function (e) {
    console.log(e);
    this.data.feedback.value = e.detail.value;
    this.setData({
      describeNo: e.detail.cursor,
      feedback: this.data.feedback
    });
  },

  // 评分提交
  ratingSubmit: function () {
    let ratingArray = [];
    for (let i in this.data.surveyResult) {
      ratingArray.push(this.data.surveyResult[i])
    }
    if (ratingArray.length === this.data.surveyList.length) {
      ratingArray.push(this.data.feedback);
      console.log('answer',ratingArray);
      var that = this;
      util.NetRequest({
        url: '/api/v1/sr/suvery?suveryid=' + that.data.suveryid + '&srid=' + that.data.srid,///site-mini/evaluation
        method: "POST",
        data: {
          srid: this.data.srid,
          suveryid: this.data.suveryid,
          answer: JSON.stringify(ratingArray)
        },
        success: function (res) {
          that.setData({
            surveyList: [],
            surveySubmitted: true
          })
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
        }
      })
    } else {
      wx.showToast({
        title: '评价未完成',
        icon: 'loading',
        duration: 2000
      })
    }

  },
  //提交评论
  clickToSubmmit: function () {
    var surveyList = this.data.surveyList;
    console.log(surveyList);
    for (var i in surveyList) {
      if (surveyList[i].ValueSelectedF == false) {
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
    console.log('questionSet_result.length' + questionSet_result.length)
    for (var i = 0; i < questionSet_result.length; i++) {
      var a = {
        "QuestionId": questionSet_result[i].QuestionId,
        "QuestionDesc": questionSet_result[i].QuestionDesc,
        "AnswerId": questionSet_result[i].AnswerId,
        "AnswervaluesSet": [{
          "AnswerId": questionSet_result[i].AnswerId,
          "Value": surveyList[i].currentCount + " Star",
          "Valueid": surveyList[i].answer_value_id,
          "ValueSelected": "X"
        }]
      };
      console.log("a的QuestionId:" + a.QuestionId);
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
    console.log(data1);
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