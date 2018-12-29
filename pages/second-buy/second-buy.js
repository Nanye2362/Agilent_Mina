// pages/second-buy/second-buy.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
var dataTemplete={
  "inputTemplate5": [{ name:"input5_ordersn",nameInfo:"服务单号"}],
  "inputTemplate2": [{ name: "input2_name", nameInfo: "姓名" }, { name: "input2_tel", nameInfo: "手机" }, { name: "input2_company", nameInfo: "公司" }, { name: "input2_email", nameInfo: "E-Mail"}]
};

var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    isScroll: false,
    curIndex: 0,
    toView: 1,
    scrollH:0,
    proLink:'',
 
    shLoading: false,// 是否显示输入框
    shInputInfo: false,//  是否显示信息确认页
    showTemplate: "", //需要显示的输入模块
    hasInputError: false,
    inputError: "",
    meqiaGroup: "",//美恰分组
    productid:'',
    //服务秒购咨询
    input2_name: "",
    input2_tel: "",
    input2_company: "",
    input2_email:"",

    productList: [],
    // meqiaGroup: "T",//美恰分组
    server: config.Server,
    templete: 'inputTemplate2', 
    checkfun: 'checkSales', 
    tapfun: 'salesTap',
    desc: '服务秒购相关事项咨询',
    leftFix:false,
    imglist: []
  },
  
  onLoad:function(options){
    var that = this;
    util.NetRequest({
      url: 'purchase/get-purchase-list',
      data: {},
      success: function (res) {
        console.log(res); //后台获取到的mycount数据
        // var fontUrl=res.fontUrl;
        wx.loadFontFace({
          family: 'iconfont',
          source: 'url("//at.alicdn.com/t/' + res.fontUrl+'.woff")',
          success(res) {

          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res.status)
          }
        });    
        that.setData({
          productList: res.data,
         
        })
      }
    });
   
  },
 onShow:function(){
   let observer = wx.createIntersectionObserver(this);
   observer.relativeTo().observe('.top-banner', (res) => {
     console.log('.top-banner');
     console.log(res);
     this.setData({
       leftFix: res.intersectionRatio > 0 ? false:true
     })
   })

 },
  // 获取右栏每块高度
  // onShow:function(){
  //   let queryRight=wx.createSelectorQuery().in(this);
  //   let heightArr=[];
  //   let s=0;
  //   queryRight.selectAll('.right-box').boundingClientRect((react)=>{
  //     // console.log(react);
  //     react.forEach((res)=>{
  //       s+=res.height;
  //       heightArr.push(s)
  //     });
  //     // console.log(heightArr);
  //     this.setData({
  //       heightArr: heightArr
  //     })
  //   });
  //   queryRight.select('.tab-right').boundingClientRect((res)=>{
  //     console.log("tab-right容器");
  //     console.log(res);
  //     // 计算容器高度
  //     this.setData({
  //       rightH:res.height
  //     })
  //   }).exec()
  // },
  // 右栏滚动监听
  // onScroll:function(e){
  //   console.log("onscroll")
  //   console.log(e);
  //   console.log(e.detail.scrollTop);
  //   var that=this;
  //   let scrollTop=e.detail.scrollTop;
  //   if (scrollTop >= 154){
  //     scrollTop = 154;
  //   } else if (scrollTop <= 0){
  //     scrollTop = 0;
  //   }
  //   setTimeout(function(){
  //     that.setData({
  //       scrollH: scrollTop
  //     })
  //   },0)
   
    // setTimeout(function () {
    // wx.pageScrollTo({
    //   scrollTop: scrollTop,
    //   duration: 50
    // })},200)
  //   var animation = wx.createAnimation({
  //     duration: 5000,
  //     timingFunction: 'ease',
  //     delay: 0
  //   });
  //   var animation2 = wx.createAnimation({
  //     duration: 5000,
  //     timingFunction: 'ease',
  //     delay: 0
  //   });
  //   if (scrollTop>3){
  //     animation.opacity(0.2).translate(0, -308).step()
  //     animation2.opacity(1).translate(0, -150).step()
  //       that.setData({
  //         bannerShow: false,
  //         lineFixed: true,
  //         ani1: animation.export(),
  //         ani21: animation2.export()
  //       })
    
  //   } else {
  //     animation.opacity(1).translate(0, 0).step()
  //     animation2.opacity(1).translate(0, 0).step()
  //       that.setData({
  //         bannerShow: true,
  //         lineFixed: false,
  //         ani2: animation.export(),
  //         ani22: animation2.export(),
  //       })
     
  // }
  // },
  // onScroll:function(e){
  //   console.log("onscroll")
  //   console.log(e);
  //   console.log(e.detail.scrollTop);
  //   let scrollTop = e.detail.scrollTop;
  //   let scrollArr=this.data.heightArr;
  //   if(scrollTop>=scrollArr[scrollArr.length-1]){
  //     return
  //   }else{
  //     for(let i=0;i<scrollArr.length;i++){
  //       if(scrollTop>=0&&scrollTop<scrollArr[0]){
  //         this.setData({
  //           curIndex:0
            
  //         })
  //       }else if(scrollTop>=scrollArr[i-1]&&scrollTop<scrollArr[i]){
  //         this.setData({
  //           curIndex: i
            
  //         })
  //       }
  //     }
  //   }
  // },
  // onPageScroll: function (e) { // 获取滚动条当前位置
  //   console.log("PageScroll");
  //   console.log(e);
 
  //   var leftFix=this.data.leftFix;
  //   var that = this;
  //   if (e.scrollTop > 154) {
  //     that.setData({
  //       leftFix:true
  //     })
  //     console.log(leftFix);
  //   }
  //   else{
  //     that.setData({
  //       leftFix: false
  //     })
  //     console.log(leftFix);
  //   }
    // var that = this;
    // //当滚动的top值最大或者最小时，为什么要做这一步是由于在手机实测小程序的时候会发生滚动条回弹，所以为了解决回弹，设置默认最大最小值   
    // if (e.scrollTop <= 0) {
    //  // e.scrollTop = 0;
    // } else if (e.scrollTop > wx.getSystemInfoSync().windowHeight) {
    //  //e.scrollTop = wx.getSystemInfoSync().windowHeight;
    // }
    // //判断浏览器滚动条上下滚动   
    // if (e.scrollTop > this.data.scrollH || e.scrollTop == wx.getSystemInfoSync().windowHeight) {
    //   that.setData({
    //     bannerShow: false
    //   })
    //   console.log('向下滚动');
    // } else{
    //   that.setData({
    //     bannerShow: true
    //   })
    //   console.log('向上滚动');
    // }

    //给scrollTop重新赋值    
    // setTimeout(function () {
    //   that.setData({
    //     scrollH: e.scrollTop
    //   })
    // }, 0)

  // },
// 左侧导航栏切换
  switchTab: function (e) {
    console.log("switchTab");
    console.log(e);
    var toView = this.data.toView;
    var curIndex = this.data.curIndex;
    console.log(toView);
    var that = this;
    // this.setData({
    //   isScroll: true
    // })
    // setTimeout(function () {
      that.setData({
        curIndex: e.currentTarget.dataset.current,
        toView: e.currentTarget.dataset.id,
      })
    // }, 0);
    // setTimeout(function () {
    //   that.setData({
    //     isScroll: false
    //   })
    // }, 1);
   
  },

//美恰联系
  startChat: function (e) {
    var app = getApp();
    // console.log("productid");
    // console.log(this.data.productid);
    // console.log("product");
    // console.log(this.data.productname);
    app.mta.Event.stat("second_buy", { "product": this.data.productname, "productid": this.data.productid});
    this.setData({
      meqiaGroup:this.data.meqiaGroup
    });
  },
  // 点击联系客服事件

  showInputPanel: function (e) {// 点击弹出信息输入
    console.log('showinputpanel');
   

    var that = this;
    // 检测工作时间
    util.checkWorktime(function () {
      switch (e.currentTarget.dataset.tapfun) {
        case "salesTap":
          that.salesTap(e);
          break;
      }
    }, function () {
      console.log(e)
      switch (e.currentTarget.dataset.tapfun) {
        case "salesTap":
          that.showOfflineText();
          break;
      }
    });

  },
  // 工作时间正式执行的函数
  salesTap: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      showTemplate: e.currentTarget.dataset.template,
      checkFun: e.currentTarget.dataset.checkfun,
      meqiaGroup: e.currentTarget.dataset.meqia,
      showDesc: e.currentTarget.dataset.desc,
      productid: e.currentTarget.dataset.productid,
      productname: e.currentTarget.dataset.productname
    })
    
    // 工作时间成功后验证是否认证过
    util.IsCertificate(function () {
      that.getCusInfo();
    }, function () {
      var userInputInfo = wx.getStorageSync('UserInputCache_ol');
      console.log(userInputInfo);
      if (userInputInfo) {
        that.setData(userInputInfo.inputInfo);
      }
      console.log(userInputInfo);
      that.setData({
        shLoading: true
      })
    })
  },
  // 验证过的，信息从后台取出
  getCusInfo: function (e) {
    var that = this;
    util.NetRequest({
      url: 'site-mini/meqia-getuserinfo',
      success: function (res) {
        console.log(res);
        that.setData({
          input2_name: res.userinfo.name,
          input2_tel: res.userinfo.tel,
          input2_company: res.userinfo.meta.company,
          input2_email:res.userinfo.meta.email
        })
          // 认证过直接显示确认信息
        var showInfo = "";
        for (var i in dataTemplete[that.data.showTemplate]) {
          showInfo += dataTemplete[that.data.showTemplate][i]["nameInfo"] + "：" + that.data[dataTemplete[that.data.showTemplate][i]["name"]] + "\r\n";
        }

        that.setData({
          shLoading: false,
          shInputInfo: true,
          showText: showInfo
        });
      }
    })
  },
  // 未认证用户输入信息为空时弹出的提示
  checkSales: function () {
    if (this.data.input2_name.length == 0) {
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

    var isEmail = this.checkEmail(this.data.input2_email);
    // console.log(this.data.input2_email);
    if (!isEmail) {
      this.setData({
        hasInputError: true,
        inputError: "请输入正确的邮箱"
      })
      return false;
    }
    // if(!isEmail(this.data.input2_email)){
    //   this.setData({
    //     hasInputError: true,
    //     inputError: "请输入正确的邮箱"
    //   })
    //   return false;
    // }

  

    this.setData({
      hasInputError: false,
      inputError: ""
    })

    return true;
  },

  checkEmail:function(str){
    var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return reg.test(str);
  },
  //右上角关闭提示框
  closeShLoading: function () {
    this.setData({
      shInputInfo: false,
    })
  },
  // 点击确认
  getInputInfo: function () {
    console.log(this.data.checkFun);
    var hasError = false;
    switch (this.data.checkFun) {
      case "checkSales":
        hasError = !this.checkSales();
        break;
    }
    var dataObj = { "type": this.data.showTemplate };
    var showInfo = "";
    for (var i in dataTemplete[this.data.showTemplate]) {
      dataObj[dataTemplete[this.data.showTemplate][i]["name"]] = this.data[dataTemplete[this.data.showTemplate][i]["name"]];
      showInfo += dataTemplete[this.data.showTemplate][i]["nameInfo"] + "：" + this.data[dataTemplete[this.data.showTemplate][i]["name"]] + "\r\n";
    }
    return { hasError: hasError, showInfo: showInfo, obj: dataObj }
  },
  // 未认证，将用户输入数据传给后台
  okTap: function (e) {
    var returnObj = this.getInputInfo();
    var email=this.data.input2_email;
    if (returnObj.hasError) {
      return false;
    }
    var that = this;
    util.NetRequest({
      url: 'site-mini/meqia-postdata',
      data: {
        'info': JSON.stringify(returnObj.obj),
        'email':email// 多传一个参数email
      },
      success: function (res) {
        console.log(res);
        if (returnObj.obj.type == 'inputTemplate2') {//缓存用户模板2输入的信息
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
          sessionId: res.id
        })
      }
    })
  },
  cancelTap: function () {
    this.setData({
      shLoading: false,
      hasInputError: false,
      inputError: "",
    
    })
  },
  // 输入信息修改
  infoCancelTap: function () {
    this.setData({
      shInputInfo: false,
      shLoading: true
    })
  },
  bindKeyInput: function (e) {
    var obj = {};
    obj[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(obj);
  },
  // 非工作时间的弹出框内容
  showOfflineText: function () {
    wx.showModal({
      title: '温馨提示',
      content: '感谢您一直以来对我们工作的关注和支持。我们的工作时间是周一至周五的 8:30-17:30，双休日（除节假日外）仅提供紧急电话技术支持，服务时间为：9:00-17:00。',
      showCancel: false,
      success: function (res) {
      }
    })
  },
  /*
   跳转图片html
  */
  skipHtml5Page: function (e) {
    console.log(e);
    var proLink=e.currentTarget.dataset.imglink;
    wx.setStorage({
      key: "openHtmlUrl",
      data: proLink ,
      success: function () {
        wx.navigateTo({
          url: '../html/openHtml',
        });
      }
    })
  },
  previewImage:function(e){
    console.log(e);
    var current = e.currentTarget.dataset.src;
    console.log(current);
    var imglist=this.data.imglist;
    imglist.push(current);
    console.log(imglist)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imglist // 需要预览的图片http链接列表  
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})