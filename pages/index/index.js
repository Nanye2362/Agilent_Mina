//index.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
//获取应用实例
var app = getApp()
var routes = require('../../utils/routes');
Page({
  formSubmit:function(e){
    var clickevent = e.detail.target.dataset.click;
    util.submitFormId(e.detail.formId);
    if (typeof(clickevent)!="undefined"){
      this[clickevent](e.detail.target);
    }
  },
  data: {
    marqueePace: 1,//滚动速度
    marqueeDistance: 200,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval2: 20, // 时间间隔
    shSystem:true,
    system_text:"系统升级中，微信在线咨询通道暂时无法使用，您可以点击下方常见问题寻求解决方案，给您带来不便，敬请谅解。",
    Server: config.Server,
    imgUrls:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    cellHeight: '120px',
    pageItems: [],
    indicatorActiveColor: '#0085d5',
    CreateTime:'',
    HeaderStatus:'',
    ServiceRequestId:'',
    Title:'',
    notice:'',
    notice_active:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    var iconWidth = (app.globalData.sysInfo.winWidth - 40) / 2;
    //腾讯mta统计结束
    this.setData({
      iconWidth: iconWidth,
      iconWidth1: iconWidth-20,
      iconWidth2: iconWidth + 20,
      iconWidth3: iconWidth + 15,
      iconWidth4: iconWidth - 15,
      winWidth: app.globalData.sysInfo.winWidth,
      winHeight: app.globalData.sysInfo.winHeight,
    })
    var that = this;
    var text='';
    console.log('index页面栈：',getCurrentPages())
    util.NetRequest({
      url: 'api/v1/check-lunch',
      method:"GET",
      data: {
      },
      success: function (res) {
        if (res.status) {
          console.log(res)
          if (res.data.CurrentSr.length!=0){
            var headStatus = that.headStatus(res.data.CurrentSr.HeaderStatus);
            console.log(headStatus)
            that.setData({
              CreateTime: res.data.CurrentSr.CreateTime,
              HeaderStatus: headStatus,
              ServiceRequestId: res.data.CurrentSr.ServiceRequestId,
              Title: res.data.CurrentSr.Title,
            })
          }
          //wx.hideLoading();
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '服务器维护中，请稍后尝试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
          //wx.hideLoading();
        }
      }
    });
    that.getBanner();

    console.log('onload' + option);
    var that = this
    console.log(app);

    if(app.globalData.isFollow == false){
      that.alertInfo("请先关注安捷伦售后服务号,可点击右上角关于小程序里进行关注");
      app.globalData.isFollow = true;
    }
  },
  // 是否显示系统故障
  showSystem:function(){
    var shSystem = this.data.shSystem;
    this.setData({
      shSystem: !shSystem
    })
  },
  getBanner:function(){
    var that = this;
    util.NetRequest({
      url: 'api/v1/slider/info',
      data: {
      },
      method:'GET',
      success: function (res) {
        var notice_active_flag;
        if(res.data.notice==''){
          notice_active_flag = false;
        }else{
          notice_active_flag = true;
        }
        console.log(res);
        that.setData({
          imgUrls: res.data.list,
          notice: res.data.notice,
         // notice_active: res.data.notice_active
        })
      }
    })
  },

  //最新服务历史图片
  headStatus: function (headStatus){
    switch(headStatus){
      //等待您确认处理结果
      case 'SR_EXCP' :
      case 'DSR_EXCP' :
        return 'waitResult';
        break;
      //在线服务订单已建立
      case 'SR_IDSO':
      case 'DSR_IDSO':
        return 'onlineBuilt';
        break;
      //服务已完成及评价邀请
      case 'SR_CLOSED':
      case 'DSR_CLOSED':
      case 'SO_RFREVIEW':
      case 'DSO_RFREVIEW':
      case 'SO_CLOSED':
      case 'DSO_CLOSED':
      case 'IHRO_CLOSED':
        return 'serviceEvaluation';
        break;
      //服务订单已生成
      case 'SO_OPEN':
      case 'DSO_OPEN':
        return 'orderBuilt';
        break;
      //备件已从库房发出
      case 'SOI_AWPTORD':
      case 'DSOI_AWPTORD':
        return 'replaceStoreroom';
        break;
      //备件已从国外库房订购
      case 'SOI_PTBO':
      case 'DSOI_PTBO':
        return 'replaceOrderOutside';
        break;
      //现场服务已安排
      case 'SOI_SCHD':
      case 'DSOI_SCHD':
        return 'spotArranged';
        break;
      //预估报价待确认
      case 'BQ_SENT':
      case 'DBQ_SENT':
        return 'estimateQuotationConfirm';
        break;
      //等待安排工程师
      case 'BQ_ACCPT':
      case 'DBQ_ACCPT':
        return 'waitArrageEngineer';
        break;
      //服务报告已就绪
      case 'SC_RFREVIEW':
      case 'DSC_RFREVIEW':
      case 'SC_SFCLOSER':
      case 'DSC_SFCLOSER':
        return 'serviceReportOk';
        break;
      //送修仪器已发出
      case 'IHRO_SHCOMP':
        return 'IHRO_SHCOMP';
        break;
      //送修仪器已收到
      case 'IHRO_RTAREC':
        return 'IHRO_RTAREC';
        break;
      //备用仪器已发出
      case 'IHRO_LOANSHCOMP':
        return 'IHRO_LOANSHCOMP';
        break;
      //交换仪器已发出
      case 'IHRO_REPLOANSHCOMP':
        return 'IHRO_REPLOANSHCOMP';
        break;
      //备用仪器已收到
      case 'IHRO_LOANRETURN':
        return 'IHRO_LOANRETURN';
        break;
    }
  },
  onShow: function () {
  },

  srOnclick: function () {
    var user = wx.getStorageSync('user');
    console.log(user);
    if (user) {
      wx.navigateTo({
        url: '../service_request/service_request'
      })
    } else {
      wx.navigateTo({
        url: '../registration/registration'
      })
    }
  },

/*
**  我要报修跳转
*/
  clickToRepair: function (event) {

    var app = getApp();
    app.mta.Event.stat(event.target.dataset.info, {});

    util.IsCertificate(function(){
        //已绑定
      if (event.detail.iswork){
        wx.navigateTo({
          url: '../serial_number/serial_number',
        });
      }else{
        //绑定 但 不是工作时间
        wx.navigateTo({
          url: '../leave_message/leave_message',
        })
      }
    },
    //未绑定
    function(){
      if (event.detail.iswork) {
        //未绑定， 且不是工作时间
        wx.navigateTo({
          url: '../auth/auth?pageName=serial_number',
        })
      }else{
        //未绑定，是工作时间
        wx.navigateTo({
          url: '../auth/auth?pageName=leave_message',
        })
      }
    });
  },
/*
** 安装申请 点击跳转
*/
  nevigateToNext: function(e){

    var app=getApp();
    app.mta.Event.stat(e.dataset.info, {});

    var url = e.dataset.url;

      util.IsCertificate(function () {
        //绑定的话,跳转相应页面
        wx.navigateTo({
          url: url,
        })
        //未绑定，则跳转认证页面
      }, function () {
        wx.navigateTo({
          url: '../auth/auth?pageName=' + e.dataset.info,

        })
      });

  },
  /*
    在线学习
   */
  gotoNextMiniProgram: function(event){
    wx.navigateToMiniProgram({
      appId: config.elearningAppid,
      path: 'pages/welcome/welcome',
      envVersion:'trial',
      success(res) {
        console.log(res)
        // 打开成功
      }
    })
  },
  skipHtml5Page: function (e) {
    wx.setStorage({
      key: "openHtmlUrl",
      data: config.Server +'site/elearning?visitType=wechatmini',
      success: function () {
        wx.navigateTo({
          url: '../html/openHtml',
        });
      }
    })
  },
  gotoPoster: function (e) {
    var url = e.currentTarget.dataset.url;
    if (e.currentTarget.dataset.type==0){
      wx.setStorage({
        key: "openHtmlUrl",
        data: url,
        success: function () {
          wx.navigateTo({
            url: '../html/openHtml',
          });
        }
      })
    }else{
      console.log("second-buy type:",e.currentTarget.dataset.url.split("?tab="))
      wx.setStorage({
        key: "secound_buy_arg",
        data: e.currentTarget.dataset.url.split("?tab=")[1],
        success: function () {
          wx.reLaunch({
            url: url,
          });
        }
      })
    }

  },

  //常见问题
  gotoSS: function(){
    wx.navigateTo({
      url: '../self_service_new/self_service_new/self_service_new',
    });
  },


  //最新服务更新
  gotoSH: function(){
    wx.navigateTo({
      url: '../service_list/service_list',
    })
  },
  /*
**  自助服务点击弹出框
*/
  clickToHint:function(){
    wx.showToast({
      title: '敬请期待',
      image: '../../images/hint.png',
      duration: 2000,
    })
  },

  clearStorage: function(){
    wx.clearStorageSync();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  alertInfo: function(text){
    wx.showModal({
      title: '温馨提示',
      content: text,
      showCancel: false,
      success: function (res) {

      }
    })
  },

})
