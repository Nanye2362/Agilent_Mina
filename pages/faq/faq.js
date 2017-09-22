// pages/faq/faq.js

var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dropdown: false,
    text: "this is a test",
    dropDownlist: [],
    TECH: '',
    questionsList: [],
    getid:'',
    chooseCont:''

  },

  onLoad: function (option) {
    console.log(option);
    var id = option.id;
    var that = this;
    util.NetRequest({
      url: 'site-mini/faq',
      data: {
        'id': id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          getid: id
        })
        var dropDownlist = that.addSelectedFlag(res.types);
        that.setData({
          dropDownlist: dropDownlist,
          questionsList: res.data
        })
      }
    });
  },

  addSelectedFlag: function(list){
      var listFlag = list;
      var getid = this.data.getid;
      
      for (var i in listFlag){
        if (getid == listFlag[i].id){
          listFlag[i].changeColor = 'true';
          this.setData({
            chooseCont: listFlag[i].name
          })
        }else{
          listFlag[i].changeColor = 'false';
        }
      };
      return listFlag;
  },

  clickTodetails: function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../faq_details/faq_details?id=' + id,
    })
  },
  /**
     * 页面的初始数据
     */
  changeChoose: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    util.NetRequest({
      url: 'site-mini/faq',
      data: {
        'id': id
      },
      success: function (res) {
        console.log(res);
        var dropList = that.data.dropDownlist;
        var chooseCont='';
        for (var i = 0; i < dropList.length; i++){
          if (id == dropList[i].id){
            chooseCont = dropList[i].name;
            }
        }
        that.setData({
          questionsList: res.data,
          chooseCont: chooseCont
        })
      }
    });
  },

  tagShow: function () {
    var that = this;
    this.setData({ dropdown: !that.data.dropdown });
  },

  clickToHide: function () {
    this.setData({ dropdown: false });
  }
})