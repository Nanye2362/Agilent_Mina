// pages/self_service/self_service.js

var util = require('../../utils/util.js');
var config = require('../../config.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    dataList: [],
    server: config.Server,
    idx: 0,
    quesList: '',
    // softListName: ['OpenLab CDS', 'test 2', 'test 3'],
    softListName: [],
    showSoft: false,
    // softList: [

    //   {
    //     name: 'OpenLab CDS',
    //     children: [
    //       { id: "4", name: "泵1", pid: "1", icon: "A1" },
    //       { id: "5", name: "检测器", pid: "1", icon: "A2" },
    //       { id: "6", name: "进样器", pid: "1", icon: "A3" },
    //       { id: "7", name: "其他", pid: "1", icon: "A4" },
    //       { id: "8", name: "软件", pid: "1", icon: "A5" }
    //     ]
    //   },
    //   {
    //     name: 'test 2',
    //     children: [
    //       { id: "4", name: "泵2", pid: "1", icon: "A1" },
    //       { id: "5", name: "检测器", pid: "1", icon: "A2" },
    //       { id: "6", name: "进样器", pid: "1", icon: "A3" },
    //       { id: "7", name: "其他", pid: "1", icon: "A4" },
    //       { id: "8", name: "软件", pid: "1", icon: "A5" }
    //     ]
    //   },
    //   {
    //     name: 'test 3',
    //     children: [
    //       { id: "4", name: "泵3", pid: "1", icon: "A1" },
    //       { id: "5", name: "检测器", pid: "1", icon: "A2" },
    //       { id: "6", name: "进样器", pid: "1", icon: "A3" },
    //       { id: "7", name: "其他", pid: "1", icon: "A4" },
    //       { id: "8", name: "软件", pid: "1", icon: "A5" }
    //     ]
    //   }
    // ],

    TECH: 'T',
    searchValue: '',
    autofocus: false,   //搜索框内自动聚焦Flag
    x: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束
    // var quesList = this.data.softList[0].children;
    var that = this;

    util.NetRequest({
      url: 'site-mini/self-service',
      success: function (res) {
        console.log("objectkeys");
        var objKeys = Object.keys(res.data);
        console.log(objKeys);
        var data = that.sortList(res);
        console.log(data);
        that.setData({
          dataList: data,
          // quesList: quesList,
          objKeys: objKeys,
          currentTab: objKeys[0],
          currentSwiper: 0
        })
      }
    });
  },


  onShow: function () {
    // var pages = getCurrentPages();
    // var _this = pages[pages.length - 1];
    // console.log("_this");
    // console.log(_this);
    // var cT = _this.data.currentTab;
    // this.setData({
    //   currentTab: cT,
    // })
  },

  moveTab: function () {
    console.log('clicktoMove')
    this.setData({
      x: this.data.x - 70
    })
  },

  sortList: function (list) {
    console.log('list', list)
    var data = list.data;
    var hots = list.hots;
    for (let i in data) {
      for (let key in hots) {
        if (data[i].id == key) {
          data[i].category = hots[key];
        }
        // console.log(hots[key]);
      }
    }
    return data;
  },
  /**
    * 热点问题跳转
    */
  clickToFaqDetails: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../faq_details/faq_details?id=' + id,
    })
  },
  bindblur: function () {
    this.setData({
      searchFlag: false,
      searchFake: true,
      searchValue: ''
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
  bindInput: function (e) {
    console.log(e);
    var value = e.detail.value;
    var inputLength = e.detail.value.length;
    this.setData({
      searchValue: value
    })
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var objKeys = this.data.objKeys;
    this.setData({
      showSoft: false
    })
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      // var currentTab = e.target.dataset.current;
      console.log('currentTab', e.target.dataset.current);
      var currentSwiper = objKeys.indexOf(e.target.dataset.current);
      // 判断是否有二级问题分类
      if (typeof (this.data.dataList[e.target.dataset.current].children) != "undefined") {
        var softListName = this.data.softListName;
        var softList = this.data.dataList[e.target.dataset.current].children;
        console.log("softList");
        console.log(softList);
        // Object.keys方法取出对象的键值组成数组，便于处理数据
        var softKeys = Object.keys(softList);
        console.log("softKeys");
        console.log(softKeys);

        for (let key in softList) {
          // let i = softKeys.indexOf(key);
          // console.log('i', i);
          // softListName[i] = softList[key].name;
          // 判断二级分类对象里是否包含三级分类
          if (typeof (softList[key].children) != "undefined") {
            
            this.data.showSoft = true;


          }
          console.log('tttttttt', this.data.showSoft)
        }
        console.log("softListName");
        console.log(softListName);
        that.setData({
          softKeys: softKeys,
          softList: softList,
          showSoft: this.data.showSoft,
         
        })
        if (this.data.showSoft == true) {
          this.getQuesList(this.data.idx);
          for(let keys in softList){
            let i = softKeys.indexOf(keys);
            console.log('i', i);
            softListName[i] = softList[keys].name;
          }
          that.setData({
            softListName: softListName
          })
        }
      
      }

      // if (currentSwiper==5){
      //   var softListName = this.data.softListName;
      //   var softList = this.data.dataList[e.target.dataset.current].children;
      //   console.log("softList");
      //   console.log(softList);
      // Object.keys方法取出对象的键值组成数组，便于处理数据
      // var softKeys = Object.keys(softList);
      // console.log("softKeys");
      // console.log(softKeys);

      // for(let key in softList){
      //   // indexOf将键值转化为index下标
      //   let i = softKeys.indexOf(key);
      //   console.log('i',i);
      //     softListName[i]=softList[key].name;         
      // }
      // console.log("softListName");
      // console.log(softListName);


      console.log('currentSwiper', currentSwiper);
      that.setData({
        currentTab: e.target.dataset.current,
        currentSwiper: currentSwiper,

      })
    }
  },

  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var objKeys = this.data.objKeys;
    this.setData({
      showSoft: false
    })
    var that = this;
    if (this.data.currentTab === objKeys[e.detail.current]) {
      return false;
    } else {
      var currentTab = objKeys[e.detail.current];
      console.log('currentTab', currentTab);
      var currentSwiper = objKeys.indexOf(currentTab);
      // 判断是否有二级问题分类
      if (typeof (this.data.dataList[currentTab].children) != "undefined") {
        var softListName = this.data.softListName;
        var softList = this.data.dataList[currentTab].children;
        console.log("softList");
        console.log(softList);
        // Object.keys方法取出对象的键值组成数组，便于处理数据
        var softKeys = Object.keys(softList);
        console.log("softKeys");
        console.log(softKeys);

        for (let key in softList) {
          // let i = softKeys.indexOf(key);
          // console.log('i', i);
          // softListName[i] = softList[key].name;
          // 判断二级分类对象里是否包含三级分类
          if (typeof (softList[key].children) != "undefined") {

            this.data.showSoft = true;


          }
          console.log('tttttttt', this.data.showSoft)
        }
        console.log("softListName");
        console.log(softListName);
        that.setData({
          softKeys: softKeys,
          softList: softList,
          showSoft: this.data.showSoft,

        })
        if (this.data.showSoft == true) {
          this.getQuesList(this.data.idx);
          for (let keys in softList) {
            let i = softKeys.indexOf(keys);
            console.log('i', i);
            softListName[i] = softList[keys].name;
          }
          that.setData({
            softListName: softListName
          })
        }

      }

      console.log('currentSwiper', currentSwiper);
      that.setData({
        currentTab: objKeys[e.detail.current],
        currentSwiper: currentSwiper,

      })
    }
    
    // var that = this;
    // that.setData({ currentTab: objKeys[e.detail.current] });
  },

  /** 
    * 点击问题分类进入faq页面
    */
  clickToFaq: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var sid = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '../faq/faq?id=' + id + '&sid=' + sid,
    })
  },
  clickToRepair: function (e) {
    console.log(e.detail.iswork);
    if (e.detail.iswork) {
      //是工作时间跳转serial number页面
      wx.navigateTo({
        url: '../serial_number/serial_number',
      })
    } else {
      //是工作时间跳转leave-message页面
      wx.navigateTo({
        url: '../leave_message/leave_message',
      })
    }
  },
  // 软件分类picker选择
  softChange: function (e) {
    console.log(e);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      idx: e.detail.value
    })
    this.getQuesList(this.data.idx);
  },

  //对应问题分类改变
  getQuesList: function (idx) {


    var softList = this.data.softList;
    var softKeys = this.data.softKeys;
    var currentIdx = softKeys[idx];
    console.log("currentIdx");
    console.log(currentIdx);
    if (typeof (softList[currentIdx].children) != "undefined") {
      var quesList = softList[currentIdx].children;
      console.log("quesList");
      console.log(quesList);
      this.setData({
        quesList: quesList
      })
    } else {
      this.setData({
        quesList: ''
      })
    }

  }
})