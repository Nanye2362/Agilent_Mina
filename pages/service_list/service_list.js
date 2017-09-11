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
    HistoryResults: [{}],
    unCompleteList: [{}],
    unsubmmitList: [{}],
    SerialNo_list:[{}],
    getSn:'',
    getContactId:''
  },

  onLoad: function (option) {
    console.log(option);
    var contactId = '';
    if (option.contactId){
      contactId = option.contactId;
    }else{
      contactId = '';
    }
    this.setData({
      getSn: option.sn,
      getContactId: contactId
    })
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
      data: {
        ContactId: that.data.getContactId,
        SerialNo: that.data.getSn
      },
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
      console.log("=============+++++++++++++++++++++++=" + serialNu)
      var that = this;
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
        getSn: serialNu
      })
  },
  sortHistory: function(res){
    //history数据分类
    var ListAll = res.HistoryResults;
    var unCompleteList = [];
    var unsubmmitList = [];
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
      SerialNo_list: res.SerialNo_list,
      getContactId: res.SerialNo_list[0].ContactId
    });
  },

  //再次保修
  clickToRepairAgain: function(){
    wx.navigateTo({
      url: '../confirm_info/confirm_info?contactId=&&sn='
    })
  } 
 
})  