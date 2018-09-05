var app = getApp()
var util = require('../../utils/util.js');

Page({
    data: {
      mobile: '',
      nameV: false,
      companyV: false,
      snV: false,
      mobileV: true,
      userTypeV:true,
      selectHasSnVal:-1,
      selectHasSnText:"",
      noSelectHas:false,
      name:'',
      company:'',
      other:'',
      sn:'',
      MeiqiaGroup:'N',
      fromPage:"",
      userType:0,
      shLoading:false
    },
    selectHasSn:function(){
      var that=this;
      var itemList = ['有安捷伦整机设备', '没有安捷伦整机设备'];
      wx.showActionSheet({
        itemList: itemList,
        itemColor:"#0085d5",
        success: function (res) {
          var snV=false;
          //选择无序列号后序列号无线验证
          if (res.tapIndex==0){// 有序列号
            that.setData({
              sn:""
            })
            var meiqiaGroup = "";
            if (that.data.fromPage == 'salesBA_CB') {
              meiqiaGroup = "CB";
            } else {
              meiqiaGroup = "N";
            }
          }else{
            snV = true;
            that.setData({
              userTypeV: false
            })
          }

          that.setData({
            selectHasSnVal: res.tapIndex,
            selectHasSnText: itemList[res.tapIndex],
            snV:snV
          })
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    onLoad: function (options) {
      //腾讯mta统计开始
      var app = getApp();
      app.mta.Page.init();
    //腾讯mta统计结束
      var mobile = options.mobile
      if (typeof (options.pagelabel) !="undefined"){//销售组咨询过来有序列号是否存在的选择
        this.setData({
          "fromPage": options.pagelabel,
          "noSelectHas":true
        })
      } else {//普通进入，没有是否序列号选择
        this.setData({
          "selectHasSnVal":0,
          "noSelectHas": false
        })
      }
      this.setData({
        'mobile': mobile
      })
      var infoSetupData=wx.getStorageSync('infoSetup');
      if (infoSetupData){
        this.setData(infoSetupData);
      }
    },
    backHome: function () {
      util.backHome()
    },
    //submit form
    submitConfirm: function(e){
      var that=this;
      util.submitFormId(e.detail.formId);
      console.log(e.detail.value)
      //获取手机
      var mobile = this.data.mobile
      var name = this.data.name
      var company = this.data.company
      var sn = this.data.sn
      var other = this.data.other
      var fromPage = this.data.fromPage;
      var userType=this.data.userType;
      var isupload = false;
      if (isupload) {
        return false;
      }
      isupload = true;
      util.NetRequest({
        url: 'auth/info-setup',
        data: {
          'username': name,
          'mobile': mobile,
          'company': company,
          'serial_no': sn,
          'remark':other,
          'fromPage': fromPage,
          "userType":userType
        },
        success: function (res) {
          console.log(that.data);
          console.log(res);
          if (res.success == true) {
            wx.setStorageSync('infoSetup', that.data);
            if(!res.isworktime){//非工作时间
              wx.showModal({
                title: '提交成功',
                content: '信息提交成功！点击确定后返回上个页面。',
                showCancel: false,
                success: function () {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              })
            }else{//工作时间弹出美洽聊天
               that.setData({
                  "shLoading":true
               });
            }
          } else {
            wx.showModal({
              title: '重复提交',
              content: '您已提交信息，客服正在为您建档，建档成功后将通过电话或短信通知您',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              }
            })
          }
        },
        fail: function (err) {
          wx.showModal({
            title: '提交失败',
            content: '您已提交过信息，客服正在为您建档，建档成功后将通过电话或短信通知您',
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        }
      })
    },

    MtaReport: function () {
      var app = getApp();
      app.mta.Event.stat("meqia", { "group": "KATE" });
    },

    //判断输入框的值是否为空
    getname: function (e) {
      //console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ nameV: false })
      } else {
        this.setData({ 
          nameV: true,
          name: e.detail.value
         })
      }
    },
    getcompany: function (e) {
      //console.log(e.detail.value)
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ companyV: false })
      } else {
        this.setData({ 
          companyV: true,
          company: e.detail.value
         })
      }
    },
    getsn: function (e) {
      console.log(e.detail.value)
      var sn = e.detail.value.toUpperCase()
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ snV: false })
      } else {
        this.setData({ 
          snV: true,
          sn: sn
         })
      }
    },
    getmobile: function (e) {
      console.log(e.detail.value)
      var mobile = e.detail.value
      if (e.detail.value == null || e.detail.value == "") {
        this.setData({ mobileV: false })
      } else {
        this.setData({
          mobileV: true,
          mobile: mobile
        })
      }
    },    
    getother: function (e) {
      this.setData({
        other: e.detail.value
      })
    },
  //检测工作时间
  isWorkTime: function () {
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": this.data.MeiqiaGroup });
    this.setData({
      "shLoading": false
    });
  },
  radioChange:function(e){
      this.setData({
        userType: e.detail.value,
        userTypeV:true
      })
      var meiqiaGroup = "";
    if (this.data.fromPage == 'salesBA_CB') {//售前
      if (e.detail.value == 1){
        meiqiaGroup = "CB";
      }else{
        meiqiaGroup = "N";
      }
    } else {//售后
        if (e.detail.value == 1) {
          meiqiaGroup = "CA";
        } else {
          meiqiaGroup = "N";
        }
     }
  }
}) 