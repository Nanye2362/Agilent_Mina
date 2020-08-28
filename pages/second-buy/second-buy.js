// pages/second-buy/second-buy.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
var dataTemplete = {
  "inputTemplate5": [{
    name: "input5_ordersn",
    nameInfo: "服务单号"
  }],
  "inputTemplate2": [{
    name: "input2_name",
    nameInfo: "姓名"
  }, {
    name: "input2_tel",
    nameInfo: "手机"
  }, {
    name: "input2_company",
    nameInfo: "公司"
  }, {
    name: "input2_email",
    nameInfo: "E-Mail"
  }]
};

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
    transferAction: '',

    isOnShow: true,
    curIndex: 0,
    toView: 1,
    scrollH: 0,
    proLink: '',

    shLoading: false, // 是否显示输入框
    shInputInfo: false, //  是否显示信息确认页
    showTemplate: "", //需要显示的输入模块
    hasInputError: false,
    inputError: "",
    meqiaGroup: "", //美恰分组
    productid: '',
    //服务秒购咨询
    input2_name: "",
    input2_tel: "",
    input2_company: "",
    input2_email: "",

    productList: [],
    // meqiaGroup: "T",//美恰分组
    server: config.Server,
    templete: 'inputTemplate2',
    checkfun: 'checkSales',
    tapfun: 'salesTap',
    desc: '超值服务相关事项咨询',
    leftFix: false,

    finishLoadFlag: [],
    loadImg:[],

    imgFlag: 0,
    imgTotal: 0,
    tabTap: [],
    imgNum: [],
    imglist: [],
    finishTabload:[]
  },
  MtaReport:function(e){
    console.log("hehhe");
    console.log(e);
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": e.target.dataset.meqia });
    app.mta.Event.stat("second_buy", {
      "product": e.target.dataset.productname,
      "productid": e.target.dataset.productid
    });
  },
  // onLoad: function () {
  //   var app = getApp();
  //   app.mta.Page.init();
  //   let observer = wx.createIntersectionObserver(this);
  //   observer.relativeTo().observe('.top-banner', (res) => {
  //     console.log('.top-banner');
  //     console.log(res);
  //     this.setData({
  //       leftFix: res.intersectionRatio > 0 ? false : true
  //     })
  //   })
  //   console.log('----2');
  //   wx.showLoading({
  //     title: '加载中，请稍后',
  //     mask:true
  //   });
  //   console.log('----2');
  // },

  onShow: function (options) {
    console.log("onShow");
    var that = this;

    if (that.data.isOnShow) {
      util.NetRequest({
        url: 'api/v1/purchase/list',
        method:'GET',
        success: function (res) {
          console.log(res); //后台获取到的mycount数据

          //    "融资购买"
          //   "送修及翻新"
          //     "消耗品促销"
          //     "标准服务"
          //     "安捷伦大学
          // var o = {
          //   "仪器租赁":
          //   "融资购买"
          //   "送修及翻新"
          //   "消耗品促销"
          //   "标准服务"
          //   "安捷伦大学
          // }

          var list = [];

          for(var i = 0; i < res.data.list.length; i++) {
             var n = res.data.list[i]
             if (n["pmenu_name"] == "仪器租赁") {
               n["transferAction"] = util.sobotTransfer(41)
             } else if (n["pmenu_name"] == "融资购买") {
              n["transferAction"] = util.sobotTransfer(14)
             } else if (n["pmenu_name"] == "送修及翻新") {
              n["transferAction"] = util.sobotTransfer(15)
             } else if (n["pmenu_name"] == "智能实验室") {
              n["transferAction"] = util.sobotTransfer(16)
            }else if (n["pmenu_name"] == "消耗品促销") {
              n["transferAction"] = util.sobotTransfer(17)
            } else if (n["pmenu_name"] == "标准服务") {
              n["transferAction"] = util.sobotTransfer(18)
            } else if (n["pmenu_name"] == "安捷伦大学") {
              n["transferAction"] = util.sobotTransfer(19)
            } else if (n["pmenu_name"] == "方法与应用") {
               n["transferAction"] = util.sobotTransfer(18)
             }
            list.push(n)
          }
          console.log('---------------------------')

          wx.loadFontFace({
            family: 'iconfont',
            source: 'url("//at.alicdn.com/t/' + res.data.font_url + '.woff")',
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
            productList: list,
            toView: res.data.list[that.data.curIndex]['id']
          })

        }
      });
    };
    that.data.isOnShow = true;
  },

  onLoad: function (e) {
    var app = getApp();

    app.mta.Page.init();
    console.log('onload curIndex');
    console.log(e);
    var storageIndex = wx.getStorageSync('secound_buy_arg');
    wx.removeStorageSync('secound_buy_arg');
    console.log(storageIndex);

    if (typeof (e.index) != "undefined") {
      this.data.tabTap[e.index] = true;
      this.setData({
        curIndex: e.index,
        tabTap: this.data.tabTap
      })
    } else if (storageIndex.length>0){
      this.data.tabTap[storageIndex] = true;
      this.setData({
        curIndex: storageIndex,
        tabTap: this.data.tabTap
      })
    } else {
      this.setData({
        tabTap: [true]
      })
    }
    //  console.log('----2');
    //  wx.showLoading({
    //    title: '加载中，请稍后',
    //    mask: true
    //  });
    //  console.log('----2');
    let observer = wx.createIntersectionObserver(this);
    observer.relativeTo().observe('.top-banner', (res) => {
      console.log('.top-banner');
      console.log(res);
      this.setData({
        leftFix: res.intersectionRatio > 0 ? false : true
      })
    })

  },

  // 左侧导航栏切换
  switchTab: function (e) {
    // console.log("switchTab");
    // console.log(e);
    var toView = e.currentTarget.dataset.id;
    var curIndex = e.currentTarget.dataset.current;
    var productList = this.data.productList;
    // console.log('this.data.imgNum[curIndex]');
    console.log(curIndex);
    // console.log(this.data.imgNum[curIndex]);


    // if (this.data.imgNum[curIndex] == '' || this.data.imgNum[curIndex] == undefined) {
    //   this.data.imgFlag = 0;
    //   this.data.finishLoadFlag=[];
    //   console.log('ppppppppppp');
    // }

    var tabTap = this.data.tabTap;
    tabTap[curIndex] = true;


    this.setData({
      curIndex: curIndex,
      // imgFlag: this.data.imgFlag,
      toView: toView,
      // finishLoadFlag: this.data.finishLoadFlag,
      tabTap: tabTap
    })

  },

  toTrial:function(){
    wx.navigateTo({
      url: '../trial_calculation/trial_calculation',
    });
  },

  //美恰联系
  startChat: function (e) {
    var app = getApp();
    // console.log("productid");
    // console.log(this.data.productid);
    // console.log("product");
    // console.log(this.data.productname);
    app.mta.Event.stat("second_buy", {
      "product": this.data.productname,
      "productid": this.data.productid
    });
    this.setData({
      meqiaGroup: this.data.meqiaGroup
    });
  },
  // 点击联系客服事件

  showInputPanel: function (e) { // 点击弹出信息输入
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
      url: 'api/v1/wechat/sobot/user-info',//site-mini/meqia-getuserinfo   
      method:"GET",
      success: function (res) {
        console.log(res);
        that.setData({
          input2_name: res.userinfo.name,
          input2_tel: res.userinfo.tel,
          input2_company: res.userinfo.meta.company,
          input2_email: res.userinfo.meta.email
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

  checkEmail: function (str) {
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
    var dataObj = {
      "type": this.data.showTemplate
    };
    var showInfo = "";
    for (var i in dataTemplete[this.data.showTemplate]) {
      dataObj[dataTemplete[this.data.showTemplate][i]["name"]] = this.data[dataTemplete[this.data.showTemplate][i]["name"]];
      showInfo += dataTemplete[this.data.showTemplate][i]["nameInfo"] + "：" + this.data[dataTemplete[this.data.showTemplate][i]["name"]] + "\r\n";
    }
    return {
      hasError: hasError,
      showInfo: showInfo,
      obj: dataObj
    }
  },
  // 未认证，将用户输入数据传给后台
  okTap: function (e) {
    var returnObj = this.getInputInfo();
    var email = this.data.input2_email;
    if (returnObj.hasError) {
      return false;
    }
    var that = this;
    util.NetRequest({
      url: 'api/v1/wechat/sobot/postdata',//site-mini/meqia-postdata
      method:"POST",
      data: {
        'info': JSON.stringify(returnObj.obj),
        'email': email // 多传一个参数email
      },
      success: function (res) {
        console.log(res);
        console.log(res.id);
        if (returnObj.obj.type == 'inputTemplate2') { //缓存用户模板2输入的信息
          var userInputInfo = {
            inputInfo: returnObj.obj,
            sessionId: res.id
          };
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
      success: function (res) { }
    })
  },
  /*
   跳转图片html
  */
  skipHtml5Page: function (e) {
    console.log('skipHtml5Page');
    console.log(e);
    // var proLink = e.currentTarget.dataset.imglink;
    var proLink = e.detail.currentTarget.dataset.imglink;
    if (proLink.length != 0) {
      wx.setStorage({
        key: "openHtmlUrl",
        data: proLink,
        success: function () {
          wx.navigateTo({
            url: '../html/openHtml',
          });
        }
      })
    }

  },
  previewImage: function (e) {
    console.log('previewImage');
    console.log(e);
    // var current = e.currentTarget.dataset.src;
    var current = e.detail.currentTarget.dataset.src;
    console.log(current);
    var imglist = this.data.imglist;
    imglist.push(current);
    var isOnShow = this.data.isOnShow;
    var that = this;
    console.log(imglist)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imglist, // 需要预览的图片http链接列表
      success: function (res) {
        that.setData({
          isOnShow: false
        })
      }
    })
  },
  loadFinish: function (e) {

    console.log('11111加载图片---');
    // console.log(e);

    var imgFlag = this.data.imgFlag;
    var loadImg = this.data.loadImg;
    var finishLoadFlag = this.data.finishLoadFlag;
    var finishTabload = this.data.finishTabload;
    var productList = this.data.productList;
    var curIndex = this.data.curIndex;
    console.log('ccccccc', curIndex);
    var imgTotal = productList[curIndex].PRODUCT_INFO.length;

    finishLoadFlag[imgFlag]=true;

    loadImg.splice(curIndex, 1, { finishLoadFlag });
    console.log('1111111111111222222');
    console.log(loadImg);

    console.log("finishLoadFlag");
    console.log(this.data.finishLoadFlag);
    ++imgFlag;
    // var that=this;
    // setTimeout(function () {
      this.setData({
        imgFlag: imgFlag,
        finishLoadFlag: finishLoadFlag,
        loadImg: loadImg
      })

    console.log("imgFlag");
    console.log(this.data.imgFlag);
    // console.log(imgFlag);
    // console.log(imgTotal);

    if (imgFlag == imgTotal) {
      this.data.imgNum[curIndex] = imgFlag;
      finishTabload[curIndex]=true;
      console.log(this.data.imgNum);
      this.setData({
        imgNum: this.data.imgNum,
        finishTabload: finishTabload

      })
    }


  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
