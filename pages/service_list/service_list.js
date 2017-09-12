var app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    dropdown: false,
    reportFlag: false,
    InstrumentCount: 0,
    HistoryResults: [],
    unCompleteList: [],
    unsubmmitList: [],
    SerialNo_listFlag: [],
    getSn:'',
    getContactId:''
  },

  onLoad: function (option) {
    console.log(option);
    if(option){
      var contactId = '';
      if (option.contactId) {
        contactId = option.contactId;
      } else {
        contactId = '';
      }
      this.setData({
        getSn: option.sn,
        getContactId: contactId
      })
    }
    console.log('option-sn============================='+option.sn)
    var that = this;


    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    //请求后台接口
    util.NetRequest({
      url: 'site-mini/service-list',
      success: function (res) {
        that.sortHistory(res);
      }
    });
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  tagShow: function(){
    var that = this;
    this.setData({dropdown: !that.data.dropdown});
  },

  clickToHide:function(){
    console.log(this);
    this.setData({dropdown: false});
  },

  //序列号选择
  clickToChoose: function(e){
      var ID = e.currentTarget.dataset.id;
      var serialNu = e.currentTarget.dataset.num;
      var index = e.currentTarget.dataset.index;
      var that = this;
      var SerialNo_list = that.data.SerialNo_listFlag;
      SerialNo_list[index].changeColor = true;
      util.NetRequest({
        url: 'sr/get-history-formini',
        data: { 
          'ContactId': ID,
          'SerialNo': serialNu,
          'index': that.data.currentTab
        },
        success: function(res){
         
          //history数据分类
          console.log('choose'+res)
          that.sortHistory(res);

        }
      })
      this.setData({
        getSn: serialNu,
        SerialNo_listFlag: SerialNo_list
      })
  },

  //将数据根据不同状态分类
  sortHistory: function(res){
    console.log('sortHistory++++++++++++++++'+res);
    //history数据分类
    var ListAll = res.HistoryResults;
    var unCompleteList = [];
    var unsubmmitList = [];
    var getSerialNo_list = res.SerialNo_list;
    var SerialNo_list = this.data.SerialNo_list;

    if (getSerialNo_list.length < SerialNo_list.length) {
      getSerialNo_list = SerialNo_list;
    }
    var SerialNo_listFlag = this.addcolorFlag(getSerialNo_list);

    for (var i = 0; i < ListAll.length; i++) {
      if (ListAll[i].SrStatus == 'WIP') {
        unCompleteList.push(ListAll[i]);
      }
      if (ListAll[i].SrStatus == 'CPLT' && ListAll[i].SurveySubmitted == 'N') {
        unsubmmitList.push(ListAll[i]);
      }
    }
    this.setData({
      InstrumentCount: res.InstrumentCount,
      HistoryResults: res.HistoryResults,
      unCompleteList: unCompleteList,
      unsubmmitList: unsubmmitList,
      SerialNo_listFlag: SerialNo_listFlag,
      getContactId: res.SerialNo_list[0].ContactId
    });
  },

  //序列号列表加入changecolor标识
  addcolorFlag: function(list){
    var SerialNo_list_flag = list;
      for(var i=0; i<list.length; i++){
        SerialNo_list_flag[i].changeColor = false;
      }
      console.log(SerialNo_list_flag)
      return SerialNo_list_flag;
  },

  //查找列表中与所传数据相同的index
  findSameIndex: function(serN,list){
      var index = 0;
      if (list.length){
        for (var i = 0; i < list.length; i++){
          if (serN == list[i].SerialNo){
              index = i;
            }
        }
      }
     
      return index
  },

  //再次报修
  clickToRepairAgain: function(){
    wx.navigateTo({
      url: '../confirm_info/confirm_info?contactId=&&sn='
    })
  } ,

  //前往评价
  clickToEvaluate: function(e){
    var Surveyid = e.currentTarget.dataset.surveyid;
    var SerialID = e.currentTarget.dataset.srid;
    wx.navigateTo({
      url: '../evaluate/evaluate?Surveyid=' + Surveyid + '&&SerialNo=' + SerialID
    })
  },

  //打开PDF
  clickToReport: function(e){

      //window.location.href = host + 'file/open-file?ServconfId=' + ServconfId;


    var url = util.Server + 'file/open-file?ServconfId=' + e.currentTarget.dataset.servconfId;
    wx.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath;
        console.log('filePath= '+filePath);
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function(res){
            console.log(res)
          }
        })
      },
      fail: function(){
        console.log('PDF下载失败')
      },
    })
  }
 
})  