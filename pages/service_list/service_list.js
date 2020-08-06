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
    unConfirmList:[],
    unConfirmListL:0,
    SerialNo_listFlag: [],
    getSn: '',
    getContactId: '',
    isSearch:false,
    TECH: 'N_srid:',
    SN: ';sn:',
    searchValue: '',
    isFirst:true,
    transferAction:''
  },
  onShow: function () {
    var that = this;
    console.log(this.data.isFirst);
    if (!this.data.isFirst){
      //请求后台接口 data:{SrId:} site-mini/service-details
      util.NetRequest({
        url: 'api/v1/sr/history',
        method:'GET',
        success: function (res) {
          console.log(res);
          that.sortHistory(res);
          that.setData({
            getContactId: res.data.SerialNo_list[0].ContactId
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

    if(Object.keys(app.globalData.sobotData).length === 0){
      util.NetRequest({
        url: 'wechat-mini/get-global-group',
        success: function (res) {
          app.globalData.sobotData = res.data;
          util.getUserInfoSobot();
          that.setData({
            transferAction:util.sobotTransfer(6),
          });
        }
      });
    }else{
      this.setData({
        transferAction: util.sobotTransfer(6)
      });
    }

    //若有传参，则调取gethistory接口， 若没有传参，调取server-list接口
    if (option.sn) {
      this.setData({
        getSn: option.sn,
        getContactId: option.contactId,
        currentTab: 2
      });
      //请求后台接口
  // sr/history-filter
      util.NetRequest({
        url: 'sr/get-history-formini',
        data: {
          'ContactId': option.contactId,
          'SerialNo': option.sn
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
        url: 'api/v1/sr/history',
        method:'GET',
        success: function (res) {
          console.log(res);
          that.sortHistory(res);
          that.setData({
            getContactId: res.data.SerialNo_list[0] == undefined ? '' : res.data.SerialNo_list[0].ContactId
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
    var ListAll;
    //接口不同，判断history接口的情况
    if(res.data.history_list===undefined){
      ListAll = res.HistoryResults;
    }
    ListAll = res.data.history_list;
    var unCompleteList = [];
    var unsubmmitList = [];
    var unConfirmList = [];
    var getSerialNo_list = res.data.SerialNo_list;
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
      ListAll[i].transferAction = this.data.transferAction;
      if (ListAll[i].SrStatus == 'WIP' && ListAll[i].notConfirmed == 0) {
        unCompleteList.push(ListAll[i]);
      }
      if (ListAll[i].SrStatus == 'CPLT' && ListAll[i].SurveySubmitted == 'N')       {
        unsubmmitList.push(ListAll[i]);
      }
      if (ListAll[i].notConfirmed == 1) {
        unConfirmList.push(ListAll[i]);
      }
      // unConfirmList待确认历史表
    }
    console.log('unConfirmList',unConfirmList);
    var HistoryResultsL = ListAll.length;
    var unCompleteListL = unCompleteList.length;
    var unsubmmitListL = unsubmmitList.length;
    var unConfirmListL = unConfirmList.length;
    this.setData({
      InstrumentCount: res.data.InstrumentCount,
      HistoryResults: res.data.history_list,
      unCompleteList: unCompleteList,
      unsubmmitList: unsubmmitList,
      unConfirmList: unConfirmList,
      SerialNo_listFlag: SerialNo_listFlag,
      HistoryResultsL: HistoryResultsL,
      unCompleteListL: unCompleteListL,
      unsubmmitListL: unsubmmitListL,
      unConfirmListL: unConfirmListL

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
      url: 'api/v1/instrument/check',//sr/sr-confirm
      data: {
        sn: sn
      },
      success: function (res) {
        console.log(res);
        if (res.status == true) {
          wx.navigateTo({
            url: '../confirm_info/confirm_info' + '?id=' + res.data+"&aglNum=" + res.data.AglSN + '&CanRepair=' + res.data.CanRepair + '&group=' + JSON.stringify(res.data.group),
          })
          // wx.navigateTo({
          //   url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName + '&CanRepair=' + res.CanRepair + '&group=' + JSON.stringify(res.group),
          // })
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

  //查看物流
  trackingNo: function(e){
    var deliveryno = e.currentTarget.dataset.deliveryno;
    var sn = e.currentTarget.dataset.sn;
    wx.navigateTo({
      url: '../trackingNo/trackingNo?deliveryno=' + deliveryno + '&sn=' + sn
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

  copyTBL:function(e){
    var url = util.Server + 'site/open-file?ServconfId=' + e.currentTarget.dataset.servconfId;
    wx.setClipboardData({
      data: url,
      success:function (res) {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '服务报告链接已黏贴到剪贴板，请打开浏览器后下载',
          showCancel: false
        });
      }

    });
  },

  //跳转我的评价
  clickToMyComment: function (e) {
    var Surveyid = e.currentTarget.dataset.surveyid;
    var SerialID = e.currentTarget.dataset.srid;
    wx.navigateTo({
      url: '../evaluation/evaluation?Surveyid=' + Surveyid + '&&SerialNo=' + SerialID
    })
  },
// 搜索服务列表
  clickToSearch: function (e) {
    //腾讯mta记录搜索事件开始
    // var app = getApp();
    // app.mta.Event.stat("self_service_search", { "query": this.data.searchValue });
    //腾讯mta记录搜索事件结束

    console.log('确定');
    var value = this.data.searchValue;
    wx.navigateTo({
      url: '../service_result/service_result?value=' + value,
    })
    // var that = this;
    // console.log(value)
    // util.NetRequest({
    //   url: 'sr/history-filter',
    //   data: {
    //     'keywords': value
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     var resultList = res.HistoryFilter;
    //     var isSearch=true;
    //     that.setData({

    //       resultList: resultList,
    //       isSearch: isSearch
    //     })
    //   }
    // });
  },
  bindInput: function (e) {
    console.log(e);
    var value = e.detail.value;
    var inputLength = e.detail.value.length;
    this.setData({
      searchValue: value
    })
  },
  //前往预估报价单确认页面
  clickToBudgetConfirm: function (e) {
    var objectId = e.currentTarget.dataset.objectid;
    console.log(objectId);
    var srId = e.currentTarget.dataset.srid;
    wx.navigateTo({
      url: '../budget_confirm/budget_confirm?srId=' + srId + '&&objectId=' + objectId
    })
  },
// 点击跳转历史详情 data:{SrId:} site-mini/service-details
  clickToDetail: function (e) {
    console.log(e);
    var SrId = e.currentTarget.dataset.srid;
    // var SrDesc = e.currentTarget.dataset.srdesc;
    // var Surveyid = e.currentTarget.dataset.surveyid;
    console.log(SrId);
    wx.navigateTo({
      url: '../service_details/service_details?SrId=' + SrId
    })
  },
})
