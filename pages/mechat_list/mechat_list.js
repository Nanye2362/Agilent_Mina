// pages/mechat_list/mechat_list.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    input5_ordersn:"",
    //消耗品咨询
    input2_name:"",
    input2_tel:"",
    input2_company:""
  },
  bindfocusSrId:function(){
    if(this.data.input5_ordersn.length==0){
        this.setData({
          input5_ordersn:"810"
        });
    }
  },
  startChat:function(){
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
  headImgTap:function(){
    wx.setStorage({
      key: "openHtmlUrl",
      data: "https://www.chem.agilent.com/store/",
      success:function(){
        wx.navigateTo({
          url: '../html/openHtml',
        });
      }
    })
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
    obj[e.target.dataset.name] = e.detail.value;
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
  showInputPanel:function(e){// 点击弹出信息输入
    var that=this;
    util.checkWorktime(function () {
      switch (e.target.dataset.tapfun){
        case "salesTap":
          that.salesTap(e);
          break;
        case "orderTap":
          that.orderTap(e);
          break;
        case "srTap":
          that.srTap(e);
          break;
      }
    },function(){
      switch (e.target.dataset.tapfun) {
        case "salesTap":
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
      }
    });
    
  },
  salesTap:function(e){
    console.log(e);
    var that = this;
    that.setData({
      showTemplate: e.target.dataset.template,
      checkFun: e.target.dataset.checkfun,
      meqiaGroup: e.target.dataset.meqia
    })

    util.IsCertificate(function () {
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
    }, function () {
      that.setData({
        shLoading: true
      })
    })
  },
  orderTap:function(e){
    var that=this;
    util.IsCertificate(function () {
      //绑定的话,跳转相应页面
      that.setData({
        showTemplate: e.target.dataset.template,
        checkFun: e.target.dataset.checkfun,
        meqiaGroup: e.target.dataset.meqia,
        shLoading: true
      })
      //未绑定，则跳转认证页面
    }, function () {
      wx.navigateTo({
        url: '../auth/auth?pageName=mechat_list',
        success:function(){
          that.setData({
            showTemplate: e.target.dataset.template,
            checkFun: e.target.dataset.checkfun,
            meqiaGroup: e.target.dataset.meqia,
            //shLoading: true
          })
        }
      })
    });

  }
  ,checkOrder:function(){
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene);
    console.log(scene);
    //getApp().editTabBar();   
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
        title: '提示',
        content: '感谢您一直以来对我们工作的关注和支持。我们的工作时间是周一至周五的 8:30-17:30，双休日（除节假日外）仅提供紧急电话技术支持，服务时间为：9:00-17:00。',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  }
})




var dataTemplete={
  "inputTemplate5": [{ name:"input5_ordersn",nameInfo:"服务单号"}],
  "inputTemplate2": [{ name: "input2_name", nameInfo: "姓名" }, { name: "input2_tel", nameInfo: "手机" },{ name: "input2_company", nameInfo: "公司" }]
}
