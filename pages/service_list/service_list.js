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
    HistoryResults: [],  //全部
    HistoryResultsL: 0,
    unCompleteList: [],  //进行中
    unCompleteListL: 0,
    unsubmmitList: [],   //待评价
    unsubmmitListL: 0,
    SerialNo_listFlag: [],
    getSn: '',
    getContactId: '',
    TECH: 'T_srid:',
    SN: ';sn:',
    isFirst:true
  },
  onShow: function () {
    var that = this;
    console.log(this.data.isFirst);
    if (!this.data.isFirst){
      //请求后台接口
      util.NetRequest({
        url: 'site-mini/service-list',
        success: function (res) {
          console.log(res);
          that.sortHistory(res);
          that.setData({
            getContactId: res.SerialNo_list[0].ContactId
          });
        }
      });
    }
    this.data.isFirst = false;
  },
  onLoad: function (option) {
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束
    console.log('option-sn=============================' + option.sn)
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

    //若有传参，则调取gethistory接口， 若没有传参，调取server-list接口
    if (option.sn) {
      console.log(option.length)
      this.setData({
        getSn: option.sn,
        getContactId: option.contactId,
        currentTab: 2
      });
      //请求后台接口

      util.NetRequest({
        url: 'sr/get-history-formini',
        data: {
          'ContactId': option.contactId,
          'SerialNo': option.sn,
        },
        success: function (res) {
          //history数据分类
          console.log('choose' + res)
          that.sortHistory(res);

          var SerialNo_list = that.data.SerialNo_listFlag;
          for (var i = 0; i < SerialNo_list.length; i++) {
            if (option.sn == SerialNo_list[i].SerialNo) {
              SerialNo_list[i].changeColor = true;
            }
          }

          that.setData({
            getSn: option.sn,
            SerialNo_listFlag: SerialNo_list
          })
        }
      })
    } else {
      //请求后台接口
      util.NetRequest({
        url: 'site-mini/service-list',
        success: function (res) {
          that.sortHistory(res);
          that.setData({
            getContactId: res.SerialNo_list[0].ContactId
          });
        }
      });
    }
  },
  /**
   * 滑动切换tab
   */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  MtaReport: function(){
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'TECH' });
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

  tagShow: function () {
    var that = this;
    this.setData({ dropdown: !that.data.dropdown });
  },

  clickToHide: function () {
    console.log(this);
    this.setData({ dropdown: false });
  },

  //序列号选择
  clickToChoose: function (e) {
    var ID = e.currentTarget.dataset.id;
    var serialNu = e.currentTarget.dataset.num;
    var index = e.currentTarget.dataset.index;
    var that = this;

    util.NetRequest({
      url: 'sr/get-history-formini',
      data: {
        'ContactId': ID,
        'SerialNo': serialNu,
        'index': that.data.currentTab
      },
      success: function (res) {
        //history数据分类
        console.log('choose' + res)
        that.sortHistory(res);

        var SerialNo_list = that.data.SerialNo_listFlag;
        if (index != undefined) {
          SerialNo_list[index].changeColor = true;
        }
        that.setData({
          getSn: serialNu,
          SerialNo_listFlag: SerialNo_list
        })
      }
    })
  },

  //将数据根据不同状态分类
  sortHistory: function (res) {
    console.log(res);
    //history数据分类
    var ListAll = res.HistoryResults;
    var unCompleteList = [];
    var unsubmmitList = [];
    var getSerialNo_list = res.SerialNo_list;
    var SerialNo_list = this.data.SerialNo_listFlag;
    var TECH = this.data.TECH;
    var SN = this.data.SN;
    if (getSerialNo_list == null || getSerialNo_list.length < SerialNo_list.length) {
      getSerialNo_list = SerialNo_list;
    }


    var SerialNo_listFlag = this.addcolorFlag(getSerialNo_list);

    for (var i = 0; i < ListAll.length; i++) {
      ListAll[i].TECH = TECH;
      ListAll[i].SN = SN;
      if (ListAll[i].SrStatus == 'WIP') {
        unCompleteList.push(ListAll[i]);
      }
      if (ListAll[i].SrStatus == 'CPLT' && ListAll[i].SurveySubmitted == 'N') {
        unsubmmitList.push(ListAll[i]);
      }
    }

    var HistoryResultsL = ListAll.length;
    var unCompleteListL = unCompleteList.length;
    var unsubmmitListL = unsubmmitList.length;
    this.setData({
      InstrumentCount: res.InstrumentCount,
      HistoryResults: res.HistoryResults,
      unCompleteList: unCompleteList,
      unsubmmitList: unsubmmitList,
      SerialNo_listFlag: SerialNo_listFlag,
      HistoryResultsL: HistoryResultsL,
      unCompleteListL: unCompleteListL,
      unsubmmitListL: unsubmmitListL
    });
  },

  //序列号列表加入changecolor标识
  addcolorFlag: function (list) {
    var SerialNo_list_flag = list;
    for (var i = 0; i < list.length; i++) {
      SerialNo_list_flag[i].changeColor = false;
    }
    console.log(SerialNo_list_flag)
    return SerialNo_list_flag;
  },

  //再次报修
  clickToRepairAgain: function (e) {
    var sn = e.currentTarget.dataset.sn;
    util.NetRequest({
      url: 'sr/sr-confirm',
      data: {
        serial_number: sn
      },
      success: function (res) {
        console.log(res);
        if (res.success == true) {
          wx.navigateTo({
            url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName,
          })
        }
      }
    })

  },

  //前往评价
  clickToEvaluate: function (e) {
    var Surveyid = e.currentTarget.dataset.surveyid;
    var SerialID = e.currentTarget.dataset.srid;
    wx.navigateTo({
      url: '../evaluate/evaluate?Surveyid=' + Surveyid + '&&SerialNo=' + SerialID
    })
  },

  //打开PDF
  clickToReport: function (e) {
    var url = util.Server + 'site/open-file?ServconfId=' + e.currentTarget.dataset.servconfId;
    wx.showLoading({
      title: '下载中...',
      mask: true
    })

    var downloadTask = wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        console.log('filePath= ' + filePath);
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '报告显示错误。如果需要此报告，请返回，点击发起会话向客服索取。',
              showCancel: false,
            })
          }
        })
      },
      complete: function () {
        wx.hideLoading();
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '报告下载失败，请检测网络。',
          showCancel: false,
        })
      },
    })
  },

  //跳转我的评价
  clickToMyComment: function (e) {
    var Surveyid = e.currentTarget.dataset.surveyid;
    var SerialID = e.currentTarget.dataset.srid;
    wx.navigateTo({
      url: '../evaluation/evaluation?Surveyid=' + Surveyid + '&&SerialNo=' + SerialID
    })
  }
}) 