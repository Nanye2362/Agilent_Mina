// pages/mechat_list/mechat_list.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '已致电安捷伦客服热线的用户，需补充相关图片给技术工程师参考的，可以点击页面右下方“我的”，进入服务历史，找到相应的咨询单号后直接发起会话。',
    imgUrl: config.Server + 'images/mechat_poster.jpg',
    shLoading:false,// 是否显示输入框
    shInputInfo:false,//  是否显示信息确认页
    showTemplate:"", //需要显示的输入模块
    checkFun:"",//需要检测输入信息的函数
    sessionId:0,//传递给美恰消息的id标识
    hasInputError:false,
    inputError  :"",
    meqiaGroup:"",//美恰分组
    //仪器使用 序列号
    input1_sn:"",
    //上传图片咨询
    input5_ordersn:"810",
    //消耗品咨询
    input2_name:"",
    input2_tel:"",
    input2_company:"",
    Server:config.Server,
    //showDesc:"",
    //showInfo:[false,false,false,false,false,false,false,false,false],
    list: [{ title: '分析仪器报修/咨询', img: 'repair', class: 'widthFix', color: 'blue', templete: 'inputTemplate1', checkfun: 'checkSales', tapfun: 'srTap', meqia: 'T', desc:'售后仪器操作，故障咨询'},  
      { title: '消耗品咨询/购买', img: 'buy', class: 'widthFix', color: 'green', templete: 'inputTemplate2', checkfun: 'checkSales', tapfun: 'salesBATap', meqia: 'CB', desc: '购买消耗品相关问题咨询' },
      { title: '色谱柱/前处理售后', img: 'afterbuy', class: 'widthFix', color: 'green', templete: 'inputTemplate2', checkfun: 'checkSales', tapfun: 'salesBATap', class: 'widthFix', meqia: 'CA', desc: '消耗品应用相关咨询' },
      { title: '实验室仪器采购', img: 'purchase', color: 'tree', templete: 'inputTemplate2', checkfun: 'checkSales', tapfun: 'salesTap', class: 'widthFix', meqia: 'K', desc: '实验室分析仪器购买咨询'},
      // { title: '实验室服务方案', img: 'solution', color: 'tree', templete: 'inputTemplate2', class: 'widthFix', checkfun: 'checkSales', tapfun: 'salesTap', meqia: 'S', desc: '实验室企业级服务、整体搬迁、法规认证、分析仪器维修/维护合同等' },
      { title: '电话工单补充图片', desc: '已有服务单号快速入口', class: 'widthFix', templete: 'inputTemplate5', checkfun: 'checkOrder', tapfun: 'orderTap', meqia: 'N', img: 'solution', color: 'tree', },
      { title: '售后服务合同', img: 'contract', color: 'yellow', class: 'widthFix', templete: 'inputTemplate2', checkfun: 'checkSales', tapfun: 'salesTap', meqia: 'S', desc: '售后服务合同相关事项咨询' },
      { title: '实验室法规认证', img: 'OQ', color: 'yellow', templete: 'inputTemplate2', checkfun: 'checkSales', class: 'widthFix', tapfun: 'salesTap', meqia: 'S', desc: '实验室法规认证等咨询' }, 
      { title: '送修及翻新服务', img: 'renew', color: 'orange', templete: 'inputTemplate2', checkfun: 'checkSales', class: 'widthFix', tapfun: 'repairTap', meqia: 'T', desc: '仪器送修及翻新等咨询'}, 
      { title: '安捷伦大学培训', img: 'myclass', color: 'purple', templete: 'inputTemplate2', checkfun: 'checkSales', class: 'widthFix', tapfun: 'salesTap', meqia: 'E', desc: '培训名额、定制培训、课程注册等咨询' },  
    ]
  },
  // showDesc:function(e){
  //   this.closeDesc();//关闭其他
  //   var showInfo=this.data.showInfo;
  //   showInfo[e.currentTarget.dataset.key]=true;
  //   console.log(showInfo);
  //   this.setData({
  //     showInfo:showInfo
  //   })
  // },
  // closeDesc:function(){
  //   var showInfo = this.data.showInfo;
  //   for (var i in showInfo){
  //     showInfo[i]=false;
  //   }
  //    this.setData({
  //     showInfo:showInfo
  //   })
  // },
  // bindfocusSrId:function(){
  //   if(this.data.input5_ordersn.length==0){
  //       this.setData({
  //         input5_ordersn:"810"
  //       });
  //   }
  // },
  startChat:function(e){ 

    console.log('----------',e);
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": e.detail.currentTarget.dataset.group});
    this.setData({
      shInputInfo: false,
      sessionId:0
    });
  },
  getInputInfo:function(){
    console.log(this.data.checkFun);
    var hasError=false;
    switch (this.data.checkFun){
      case "checkOrder":
        hasError=!this.checkOrder();
        break;
      case "checkSales":
        hasError = !this.checkSales();
        break;
    }

    var dataObj = { "type": this.data.showTemplate};
    var showInfo="";
    for(var i in dataTemplete[this.data.showTemplate]){
      dataObj[dataTemplete[this.data.showTemplate][i]["name"]] = this.data[dataTemplete[this.data.showTemplate][i]["name"]];
      showInfo += dataTemplete[this.data.showTemplate][i]["nameInfo"] + ":" + this.data[dataTemplete[this.data.showTemplate][i]["name"]]+"\r\n";
    }
    return { hasError: hasError, showInfo: showInfo, obj: dataObj}
  },
  okTap:function(e){
    var returnObj = this.getInputInfo();
    if (returnObj.hasError){
        return false;
    }
    var that=this;
    util.NetRequest({
      url: 'site-mini/meqia-postdata',
      data: {
        'info': JSON.stringify(returnObj.obj),
      },
      success: function (res) {
        console.log(res);
        if (returnObj.obj.type=='inputTemplate2'){//缓存用户模板2输入的信息
          var userInputInfo = { inputInfo: returnObj.obj, sessionId: res.id };
          wx.setStorage({
            'key': 'UserInputCache_ol',
            'data': userInputInfo
          })
        }
      
        that.setData({
          shLoading: false,
          shInputInfo: true,
          showText: returnObj.showInfo,
          sessionId:res.id
        })
      }
    })  
  },
  cancelTap:function(){
    this.setData({
      shLoading: false,
      hasInputError: false,
      inputError: "",
      sessionId:0
    })
  },
  infoCancelTap:function(){
    this.setData({
      shInputInfo:false,
      shLoading: true
    })
  },
  bindKeyInput: function (e) {
    var obj={};
    obj[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(obj);
  },
  srTap:function(e){//立即咨询1  sr逻辑 检测是否绑定手机，如没有跳转到绑定页，如是则弹出序列号输入框
    var that = this;
      util.IsCertificate(function () {
        //绑定的话,跳转相应页面
        wx.navigateTo({
          url: '../serial_number/serial_number',
        });
        //未绑定，则跳转认证页面
      }, function () {
        wx.navigateTo({
          url: '../auth/auth?pageName=serial_number',
        })
      });
  },
  //送修
  repairTap: function(){
    wx.navigateTo({
      url: '../repair/repair',
    });
  },
  showInputPanel:function(e){// 点击弹出信息输入
    console.log('showinputpanel');
    var that=this;
    if(e.detail.iswork){
      switch (e.currentTarget.dataset.tapfun){
        case "salesTap":
          that.salesTap(e);
          break;
        case "orderTap":
          that.orderTap(e);
          break;
        case "salesBATap":
          that.salesBATap(e);
          break;
        case "srTap":
          that.srTap(e);
          break;
        case "repairTap":
          that.repairTap(e);
          break; 
      }
    }else{
      switch (e.currentTarget.dataset.tapfun) {
        case "salesTap":
          that.showOfflineText();
          break;
        case "salesBATap":
          that.showOfflineText();
          break;
        case "orderTap":
          that.showOfflineText();
          break;
        case "srTap":
          wx.navigateTo({
            url: '../leave_message/leave_message',
          });
          break;
        case "repairTap":
          wx.navigateTo({
            url: '../repair/repair',
          });
          break;
      }
    };
    
  },
  salesTap:function(e){

    console.log(e);
    var that = this;
    that.setData({
      showTemplate: e.currentTarget.dataset.template,
      checkFun: e.currentTarget.dataset.checkfun,
      meqiaGroup: e.currentTarget.dataset.meqia,
      showDesc: e.currentTarget.dataset.desc,
      titleColor: e.currentTarget.dataset.color,
      titleCon: e.currentTarget.dataset.title,
    })
    console.log(e.currentTarget.dataset.meqia)
    util.IsCertificate(function () {
      that.getCusInfo();
    }, function () {
      var userInputInfo = wx.getStorageSync('UserInputCache_ol');
      console.log(userInputInfo);
      if (userInputInfo){
        that.setData(userInputInfo.inputInfo);
      }
      console.log(userInputInfo);
      that.setData({
        shLoading: true
      })
    })
  },
  salesBATap: function(e){
    var that = this;
    that.setData({
      showTemplate: e.currentTarget.dataset.template,
      checkFun: e.currentTarget.dataset.checkfun,
      meqiaGroup: e.currentTarget.dataset.meqia,
      showDesc: e.currentTarget.dataset.desc,
      titleColor: e.currentTarget.dataset.color,
      titleCon: e.currentTarget.dataset.title,
    })
    util.IsCertificate(function () {
      that.getCusInfo();
      //未绑定，则跳转认证页面
    }, function () {
      wx.navigateTo({
        url: '../auth/auth?pageName=mechat_list&pagelabel=salesBA_'+ e.currentTarget.dataset.meqia,
      })
    });
  },
  getCusInfo: function(e){
    var that = this;
    util.NetRequest({
      url: 'site-mini/meqia-getuserinfo',
      success: function (res) {
        console.log(res);
        that.setData({
          input2_name: res.userinfo.name,
          input2_tel: res.userinfo.tel,
          input2_company: res.userinfo.meta.company
        })

        var showInfo = "";
        for (var i in dataTemplete[that.data.showTemplate]) {
          showInfo += dataTemplete[that.data.showTemplate][i]["nameInfo"] + ":" + that.data[dataTemplete[that.data.showTemplate][i]["name"]] + "\r\n";
        }

        that.setData({
          shLoading: false,
          shInputInfo: true,
          showText: showInfo
        });
      }
    })
  },
  orderTap:function(e){
    var that=this;
    util.IsCertificate(function () {
      //绑定的话,跳转相应页面
      that.setData({
        showTemplate: e.currentTarget.dataset.template,
        checkFun: e.currentTarget.dataset.checkfun,
        meqiaGroup: e.currentTarget.dataset.meqia,
        titleColor: e.currentTarget.dataset.color,
        titleCon: e.currentTarget.dataset.title,
        shLoading: true
      })
      //未绑定，则跳转认证页面
    }, function () {
      wx.navigateTo({
        url: '../auth/auth?pageName=mechat_list',
        success:function(){
          that.setData({
            showTemplate: e.currentTarget.dataset.template,
            checkFun: e.currentTarget.dataset.checkfun,
            meqiaGroup: e.currentTarget.dataset.meqia,
            //shLoading: true
          })
        }
      })
    });

  },
  checkOrder:function(){
    //服务单号格式为10位数字且是8开头
    var parm = /^8(\d){9}$/;
    if (!parm.test(this.data.input5_ordersn)){
      console.log(111);
      this.setData({
        hasInputError: true,
        inputError: "请输入正确的服务单号"
      })
       return false;
    }else{
      this.setData({
        hasInputError: false,
        inputError: ""
      })
       return true;
    }
  },
  checkSales:function(){
    if (this.data.input2_name.length==0) {
      this.setData({
        hasInputError: true,
        inputError: "请输入姓名"
      })
      return false;
    }

    if (this.data.input2_tel.length == 0) {
      this.setData({
        hasInputError: true,
        inputError: "请输入手机"
      })
      return false;
    }

    if (this.data.input2_company.length == 0) {
      this.setData({
        hasInputError: true,
        inputError: "请输入公司"
      })
      return false;
    }

    this.setData({
      hasInputError: false,
      inputError: ""
    })

    return true;
  },

  //关闭提示框
  closeShLoading: function(){
    this.setData({
      shInputInfo: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束
    //getApp().editTabBar();
    this.setData({
      iconWidth: (app.globalData.sysInfo.winWidth-30)/3,
      winWidth: app.globalData.sysInfo.winWidth
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
  
  },
  showOfflineText:function(){
      wx.showModal({
        title: '温馨提示',
        content: '感谢您一直以来对我们工作的关注和支持。我们的工作时间是周一至周五的 8:30-17:30，双休日（除节假日外）仅提供紧急电话技术支持，服务时间为：9:00-17:00。',
        showCancel: false,
        success: function (res) {
            
        }
      })
  }
})




var dataTemplete={
  "inputTemplate5": [{ name:"input5_ordersn",nameInfo:"服务单号"}],
  "inputTemplate2": [{ name: "input2_name", nameInfo: "姓名" }, { name: "input2_tel", nameInfo: "手机" },{ name: "input2_company", nameInfo: "公司" }]
}
