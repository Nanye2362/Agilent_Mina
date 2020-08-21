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
    serialNoFilterList: [],
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
      that.getServiceHistory();
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
        url: 'api/v1/wechat/get-global-group',//wechat-mini/get-global-group
        method:"GET",
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
      this.setData({
        getSn: option.sn?option.sn:'',
        // getContactId: option.contactId,
        // currentTab: 2
      });
      //请求后台接口
      // sr/history-filter
      console.log('getServiceHistory:',this.data.getSn);
      that.getServiceHistory();
  },
  getServiceHistory:function(){
    var that=this;
    util.NetRequest({
      url: 'api/v1/sr/history'+'?serial_no='+that.data.getSn+'&keywords='+that.data.searchValue,
      method:'GET',
      success: function (res) {
        //history数据分类
        console.log('sr/history:' , res)
        that.sortHistory(res);
      }
    })
  },
  
//处理数据 
  sortHistory: function (res) {
    console.log(res);
    //history数据分类
    var ListAll = res.data.history_list;
    var unCompleteList = [];
    var unsubmmitList = [];
    var unConfirmList = [];
    var TECH = this.data.TECH;
    var SN = this.data.SN;
    var serialNoFilterList = this.addcolorFlag(res.data.serial_no_list);
    for (var i = 0; i < ListAll.length; i++) {
      ListAll[i].TECH = TECH;
      ListAll[i].SN = SN;
      ListAll[i].transferAction = this.data.transferAction;
      if (ListAll[i].srStatus == 'WIP' && ListAll[i].unconfirmed == 0) {
        unCompleteList.push(ListAll[i]);
      }
      if (ListAll[i].srStatus == 'CPLT' && ListAll[i].surveySubmitted == 'N')       {
        unsubmmitList.push(ListAll[i]);
      }
      if (ListAll[i].unconfirmed == 1) {
        unConfirmList.push(ListAll[i]);
      }
      // unConfirmList待确认历史表
    }
    console.log('serialNoFilterList:',serialNoFilterList);
    var HistoryResultsL = ListAll.length;
    var unCompleteListL = unCompleteList.length;
    var unsubmmitListL = unsubmmitList.length;
    var unConfirmListL = unConfirmList.length;
    this.setData({
      HistoryResults: res.data.history_list,
      unCompleteList: unCompleteList,
      unsubmmitList: unsubmmitList,
      unConfirmList: unConfirmList,
      serialNoFilterList: serialNoFilterList,
      HistoryResultsL: HistoryResultsL,
      unCompleteListL: unCompleteListL,
      unsubmmitListL: unsubmmitListL,
      unConfirmListL: unConfirmListL
    });
  },

  //序列号列表加入changecolor标识
  addcolorFlag: function (list) {
    var that=this;
    var data = [{}];
    for (var i = 0; i < list.length; i++) {
      if (that.data.getSn == list[i]) {
        data[i].changeColor = true;
        data[i].serialNo=list[i];
      }else{
        data[i].changeColor = false;
        data[i].serialNo=list[i];

      }
    }
    return data;
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
    this.data.getSn = e.currentTarget.dataset.sn;
    var that = this;
    that.getServiceHistory();
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
  
  //查看我的评价
  clickToMyComment: function (e) {
    console.log('查看我的评价:',e);
    var Surveyid = e.currentTarget.dataset.surveyid;
    var SerialID = e.currentTarget.dataset.srid;
    wx.navigateTo({
      url: '../evaluate/evaluate?Surveyid=' + Surveyid + '&&SerialNo=' + SerialID
    })
    // wx.navigateTo({
    //   url: '../evaluation/evaluation?Surveyid=' + Surveyid + '&&SerialNo=' + SerialID
    // })
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
