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
      url: 'api/v1/guide?type=0&category_path='+sid+'_'+id,
      method:'GET',
      success: function (res) {
        console.log(res);
        that.setData({
          getid: id,
          getsid: sid
        })
        
        var tree = wx.getStorageSync('tree');
        var type = [];
        //对象转化为数组
        for(let key of Object.keys(tree[sid].children)){
          type.push(tree[sid].children[key]);
        }
        console.log(type);
        var dropDownlist = that.addSelectedFlag(type);
        console.log(dropDownlist);
        that.setData({
          dropDownlist: dropDownlist,
          questionsList: res.data.tree.article_list,
          dataList: tree,
        })
        console.log(that.data.dropDownlist);
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
            chooseCont: listFlag[i].category_name
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
    wx.setStorage({
      key: "openHtmlUrl",
      data: 'https://qa.wechat.service.agilent.com/wechat/h5/faq/details/'+id,
      success: function () {
          wx.navigateTo({
              url: '../html/openHtml',
          });
      }
    })
    return false;
    // wx.navigateTo({
    //   url: '../faq_details/faq_details?id=' + id,
    // })
  },
  /**
     * 页面的初始数据
     */
  changeChoose: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    util.NetRequest({
      url: 'api/v1/guide?type=0&category_path='+that.data.getsid+'_'+id,
      method:'GET',
      success: function (res) {
        console.log(res);
        var dropList = that.data.dropDownlist;
        var chooseCont='';
        for (var i = 0; i < dropList.length; i++){
          if (id == dropList[i].id){
            chooseCont = dropList[i].category_name;
            dropList[i].changeColor = true;
            }else{
            dropList[i].changeColor = false;
            }
        }
        that.setData({
          dropDownlist: dropList,
          questionsList: res.data.tree.article_list,
          chooseCont: chooseCont
        })
      }
    });
  },

  tagShow: function (e) {
    var that = this;
    this.setData({ dropdown: !that.data.dropdown });
  },

  clickToHide: function (e) {
    this.setData({ dropdown: false });
  },

  clickToRepair: function (e) {
    if (e.detail.iswork) {
      //是工作时间跳转serial number页面
      wx.navigateTo({
        url: '../serial_number/serial_number',
      })
    }else{
      //是工作时间跳转leave-message页面
      wx.navigateTo({
        url: '../leave_message/leave_message',
      })
    }
  },

  //点击tab跳转
  gotoTab: function(e){
    var index = e.currentTarget.dataset.index;
    var currentTab = e.currentTarget.dataset.id;
    console.log(index);
    var pages = getCurrentPages();
    console.log(pages.length);
    var nums;
    for (var i in pages) {
      if (pages[i].route =='pages/self_service/self_service'){
        console.log('就是这一页没错了!!!!!!!!!!')
        pages[i].data.currentTab = currentTab;
        console.log(pages[i].data)
        console.log(pages[i].route)
        nums = i+1;
      }
    }
    wx.navigateBack({
      delta: pages.length - nums
    })
  },
 
  clickToSearch: function (e) {
    //腾讯mta记录搜索事件开始
    var app = getApp();
    app.mta.Event.stat("self_service_search", { "query": this.data.searchValue });
    //腾讯mta记录搜索事件结束

    console.log('确定');
    var value = this.data.searchValue;
    wx: wx.navigateTo({
      url: '../search-list/search-list?value=' + value,
    })
  },
  bindInput:function(e){
    console.log(e);
    var value = e.detail.value;
    var inputLength = e.detail.value.length;
    this.setData({
      searchValue: value
    })
  },
  
})