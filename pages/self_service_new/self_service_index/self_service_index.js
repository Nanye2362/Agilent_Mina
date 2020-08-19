// pages/self_service_new/self_service_new.js

var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tree:[],
    isShow:false,
    searchValue: '',
    name:''
  },

  isFolder: function (arr) {
    var that = this;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        arr[i].isFolder = true;
        that.isFolder(arr[i].children);
      } else {
        arr[i].isFolder = false;
      }
      arr[i].isOpen = true;
    }
    return arr;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var modeType = options.id;

    var _this = this;
    if(modeType == 1){
      wx.setNavigationBarTitle({
        title: '场地准备'//页面标题为路由参数
      })
    }else if(modeType == 2){
      wx.setNavigationBarTitle({
        title: "现场培训教材"//页面标题为路由参数
      })
    }

    util.NetRequest({
      url: 'api/v1/guide?type=1',
      method:"GET",
      success: function (res) {
        console.log(res);
        //对象转化为数组
        var outArr = [];
        var inArr = [];
        //外层数组
        for(let outKey of Object.keys(res.data.tree)){
          if(res.data.tree[outKey].hasOwnProperty('children')){
            //内层数组
            for(let inKey of Object.keys(res.data.tree[outKey].children)){
              inArr.push(res.data.tree[outKey].children[inKey]);
            }
            res.data.tree[outKey].children = inArr;
            inArr = [];
          }
          outArr.push(res.data.tree[outKey]);
        }
        console.log(outArr);
        var tree = _this.isFolder(outArr);
        console.log(tree);
        _this.setData({
          tree:tree,
          isShow:true,
          name:'场地准备'
        });
      },
      complete: function () {
        wx.hideLoading();
      },
    });


  },
  clickToSearch: function (e) {
    //腾讯mta记录搜索事件开始
    var app = getApp();
    app.mta.Event.stat("self_service_search", { "query": this.data.searchValue });
    //腾讯mta记录搜索事件结束

    console.log('确定');
    var value = this.data.searchValue;
    wx: wx.navigateTo({
      url: '../self_service_search/self_service_search?value=' + value,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  menu2Show:function(e){
    console.log(e)
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
