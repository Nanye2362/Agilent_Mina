// pages/evaluation/evaluation.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Surveyid: '',
    SerialNo: '',
    describeNo: 0,
    stars:[],
    arrTitle: [],
    questionSet_result: [],
    QuestionsSet_Comments: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option);
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
        var describeNoleng = QuestionsSet_Comments.AnswervaluesSet.results[0].Value.length;
        
        that.setData({
          questionSet_result: questionSet_result,
          QuestionsSet_Comments: QuestionsSet_Comments,
          describeNo: describeNoleng
        })
        that.sortStarList();
      }
    })
  },
 

  //生成stars
  sortStarList: function () {
    var questionSet_result = this.data.questionSet_result;
    var Length = questionSet_result.length;
    
    var stars = [];
    for (var i = 0; i < Length; i++) {
      var _des = questionSet_result[i].AnswervaluesSet.results[0].Value;
      var starNum;
      switch (_des) {
        case '很好':
          starNum = 4;
          break;
        case '较好':
          starNum = 3;
          break;
        case '一般':
          starNum = 2;
          break;
        case '较差':
          starNum = 1;
          break;
        case '很差':
          starNum = 0;
          break;
        case '':
          starNum = 5;
          break;
      }

      var dataInfo = [];
      if (starNum == 5) {
        for (var j = 0; j < 5; j++) {
          var obj = {};
          obj.count = j;
          obj.src = 'star_0'
          dataInfo.push(obj);
        }
      } else {
        for (var j = 0; j < 5; j++) {
          var obj = {}
          if (j <= starNum) {
            obj.count = j;
            obj.src = 'star_1'
            dataInfo.push(obj);
          } else {
            obj.count = j;
            obj.src = 'star_0'
            dataInfo.push(obj);
          }
        }
      }

      var tempObj = {
        currentCount: starNum,
        QuestionId: questionSet_result[i].QuestionId,
        AnswerId: questionSet_result[i].AnswerId,
        QuestionDesc: questionSet_result[i].QuestionDesc,
        answer_value_id: '',
        data: dataInfo
      }
      stars.push(tempObj);
    }

    

    this.setData({
      stars: stars
    })
  },

})