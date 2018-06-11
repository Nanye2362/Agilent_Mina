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
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mta统计结束
    console.log(option);
    var id = option.id;
    var sid = option.sid;
    var that = this;
    util.NetRequest({
      url: 'site-mini/faq',
      data: {
        'id': id,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          getid: id,
          getsid: sid
        })
        var dropDownlist = that.addSelectedFlag(res.types);
        that.setData({
          dropDownlist: dropDownlist,
          questionsList: res.data,
          dataList: res.parents,
        })
      }
    });
  },

  backHome: function () {
    util.backHome()
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
          listFlag[i].changeColor = false;
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
            dropList[i].changeColor = true;
            }else{
            dropList[i].changeColor = false;
            }
        }



        that.setData({
          dropDownlist: dropList,
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
  },

  clickToRepair: function () {
    util.checkWorktime(function () {
      //是工作时间跳转serial number页面
      wx.navigateTo({
        url: '../serial_number/serial_number',
      })
    }, function () {
      //是工作时间跳转leave-message页面
      wx.navigateTo({
        url: '../leave_message/leave_message',
      })
    })
  },

  //点击tab跳转
  gotoTab: function(e){
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var pages = getCurrentPages();
    console.log(pages.length);
    var nums;
    for (var i in pages) {
      if (pages[i].route =='pages/self_service/self_service'){
        console.log('就是这一页没错了!!!!!!!!!!')
        pages[i].data.currentTab = index;
        console.log(pages[i].data)
        console.log(pages[i].route)
        nums = i+1;
      }
    }
    wx.navigateBack({
      delta: pages.length - nums
    })
  },
  
})