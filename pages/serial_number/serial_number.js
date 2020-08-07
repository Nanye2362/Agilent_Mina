// pages/serial_number/serial_number.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
    inputValue: '',
    ContactGuid: '',
    ContactId: '',
    AccountGuid: '',
    AccountId: '',
    chat: false,
    NONTECH: 'W_ssn:',
    cameraValue: '',
    shLoading: false,
    shLoading_alert:false,
    shLoading_title:"",
    shLoading_body:"",
    SerialNumber:0,
    nickName: '',
    avatarUrl: '',
    transferAction: '',
    transferAction1: '',
  },
  shClose:function(){
    this.setData({
      shLoading_alert: false,
      shLoading_title: "",
      shLoading_body: ""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mobile = wx.getStorageSync('MOBILE');
    if (mobile.length==0){
      //未绑定， 且不是工作时间
      wx.navigateTo({
        url: '../auth/auth?pageName=serial_number',
      })
    }else{
      console.log(mobile);
    }

    if (typeof (options.GroupID) !='undefined'){
      this.setData({
        GroupID: options.GroupID
      })
    }

    //腾讯mat统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mat统计结束
    var that = this;
    // util.NetRequest({
    //   url: 'site-mini/serial-no',
    //   data: '',
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       ContactGuid: res.ContactGuid,
    //       ContactId: res.ContactId,
    //       AccountGuid: res.AccountGuid,
    //       AccountId: res.AccountId
    //     })
    //   }
    // })

    util.NetRequest({
      url: 'api/v1/user/service-num',// site-mini/my-count
      method:"GET",
      data: {},
      success: function (res) {
        console.log(res); //后台获取到的mycount数据
        that.setData({
          SerialNumber: res.data.intrument_num
        });
      }
    })

    // util.NetRequest({
    //   url: 'site-mini/meqia-getuserinfo',
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       nickName: res.userinfo.name,
    //       avatarUrl: res.userinfo.avatarUrl
    //     })
    //   }
    // })

    this.setData({
      transferAction1:util.sobotTransfer(3)
    });
  },

  onUnload: function () {
    console.log('************closethepage***********');

  },

  MtaReport: function () {

    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'WLA' });
  },
  MtaReportt: function () {

    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'NONTECH' });
  },

  chooseimage: function () {

    var _this = this;
    var app=getApp();
    app.globalData.isUploading = true;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //上传图片
        /*
        wx.showLoading({
          title: '上传中...',
          mask: true
        })*/
        _this.setData({
          shLoading: true,
        })
        var startTime = new Date();
        var tempFilePaths = res.tempFilePaths;
        var session_id = wx.getStorageSync('PHPSESSID');
        if (session_id != "" && session_id != null) {
          var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id }
        } else {
          var header = { 'content-type': 'application/x-www-form-urlencoded' }
        }
        console.log(util.ocrServer + 'api/v1/instrument/ocr');//api/ocr-scan
        wx.uploadFile({
          url: util.ocrServer + 'api/v1/instrument/ocr',//api/ocr-scan
          filePath: tempFilePaths[0],
          name: 'file',
          header: header,
          success: function (res) {
            console.log(res)
            var endTime = new Date();
            var ocrSpend = endTime-startTime;
            console.log(ocrSpend);

            util.NetRequest({
              host: util.ocrServer,
              url: 'api/ocr-spend',
              showload:false,
              data: {
                ocrSpend: ocrSpend,
                serverStart: JSON.parse(res.data).serverStart,
                serverEnd: JSON.parse(res.data).serverEnd,
              },
              success: function (res) {
              }
            })

            var value = JSON.parse(res.data).result;
			      var app = getApp();
			      app.mta.Event.stat("sn_ocr", { "sn": value });
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            if (value){
              _this.setData({
                cameraValue: value,
                inputValue: value
              });
            }else{
              wx.showModal({
                title: '提示',
                content: '解析失败，请上传正确图片',
                showCancel: false,
                success: function (sm) {
                  if (sm.confirm) {
                    console.log('点击确认')
                  }
                }
              })
            }
          },
          complete: function(){
            _this.setData({
              shLoading: false,
            })
            //wx.hideLoading();
            app.globalData.isUploading = false;
          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '上传失败，请检查网络后重试',
              showCancel: false,
              success: function (sm) {
                if (sm.confirm) {
                  console.log('点击确认')
                }
              }
            })
          }
        })
      },
      fail:function(){
        app.globalData.isUploading=false;
      }
    })
  },

  saveTheValue: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    this.setData({ inputValue: value.toUpperCase() })
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(value, value.toUpperCase()),
      cursor: pos
    }


    /*
    var inputValue = e.detail.value.toUpperCase()
    console.log(inputValue)
    this.setData({ inputValue: inputValue })
    console.log(e);
    */
  },

  // RtransferAction: function(r) {
  //   console.log("进入")
  //   var result = []
  //   var keys = Object.keys(r)
  //   console.log(keys);
  //   if(keys.length <= 2) {
  //     return JSON.stringify(result)
  //   } else {
  //     var n = (keys.length -2) / 2;
  //     console.log(n)
  //     for (var i = 1; i < n; i++) {
  //       var gn_type = 'g' + `${i}` + '_type';
  //       console.log(gn_type);
  //       var gn = 'g' + `${i}`;
  //       var o = {};
  //       if (r[gn_type] == '1') {
  //         o["actionType"] = "to_group";
  //         o["deciId"] = r[gn];
  //         o["optionId"] = "3";
  //         o["spillId"] = '7';
  //       } else if (r[gn_type] == '2') {
  //         o["actionType"] = "to_service";
  //         o["deciId"] = r[gn];
  //         o["optionId"] = "1";
  //         o["spillId"] = '3';
  //       }
  //       result.push(o);
  //     }

  //     var o1 = {};
  //     var gn_type1 = 'g' + `${n}` + '_type';
  //     var gn1 = 'g' + `${n}`;

  //     if (r[gn_type1] == '1') {
  //       o1["actionType"] = "to_group";
  //       o1["deciId"] = r[gn1];
  //       o1["optionId"] = "4";
  //       o1["spillId"] = '7';
  //     } else if (r[gn_type1] == '2') {
  //       o1["actionType"] = "to_service";
  //       o1["deciId"] = r[gn1];
  //       o1["optionId"] = "2";
  //       o1["spillId"] = '3';
  //     }

  //     result.push(o1)

  //     return JSON.stringify(result)
  //   }
  // },
// 提交
  clickToSubmit: function (event) {

    var that = this;
    var serNum = this.data.inputValue;
    var contactguid = event.currentTarget.dataset.contactguid;
    var contactid = event.currentTarget.dataset.contactid;
    var accountguid = event.currentTarget.dataset.accountguid;
    var accountid = event.currentTarget.dataset.accountid;

    if(serNum == ''){
      wx.showModal({
        title: '提示',
        content:'输入的序列号不能为空!',
        showCancel:false,
        success (res) {

        }
      })
      return false;
    }

    util.NetRequest({
      url: 'api/v1/instrument/check',//sr/sr-confirm
      data: {
        sn:serNum
        // contact_guid: contactguid,
        // contact_id: contactid,
        // account_guid: accountguid,
        // account_id: accountid,
        // serial_number: serNum,
        // GroupID: that.data.GroupID
      },
      success: function (res) {
        console.log('clickToSubmit：',res);
        if (res.status == true) {
          // if (this.pageNameis == "myInstrument") {
          //   this.$router.push({
          //     path: "/serial-number-confirm",
          //     query: { pagename: "myInstrument", id: res.data }
          //   });
          // } else {
          //   this.$router.push({
          //     path: "/serial-number-confirm",
          //     query: { id: res.data }
          //   });
          // }
          console.log('clickToSubmit2：',res);
          wx.redirectTo({
            url: '../confirm_info/confirm_info' + '?id=' + res.data+"&aglNum=" + res.data.AglSN + '&CanRepair=' + res.data.CanRepair + '&group=' + JSON.stringify(res.data.group),
          })
          // wx.redirectTo({
          //   url: '../confirm_info/confirm_info' + '?ProductId=' + res.ProductId + '&ProductDesc=' + res.ProductDesc + '&SerialNo=' + res.SerialNo + '&CpName=' + res.CpName + '&ShipToName=' + res.ShipToName + "&aglNum=" + res.AglSN + '&CanRepair=' + res.CanRepair + '&group=' + JSON.stringify(res.group),
          // })
        } else {
          //transferAction:
          //'[{"actionType":"to_group","deciId":"xxx","optionId":"3","spillId":"4"},{"actionType":"to_group","deciId":"xxx","optionId":"4"}]'
          that.setData({
            transferAction1: util.RtransferAction(res.group),
            transferAction: util.RtransferAction(res.group),
          });

          var errorInfo = "您输入的序列号为：" + that.data.inputValue+"\n";
          if(res.check_sn == false){
            that.setData({
              chat: true,
              shLoading_alert: true,
              shLoading_title: "提示",
              shLoading_body: errorInfo+"序列号解析有误。您可以重新确认序列号然后上传。如有疑问，请返回点击页面下方发起会话与我们联系。"
            })
          }else{
            that.setData({
              chat: true,
              shLoading_alert: true,
              shLoading_title: "提示",
              shLoading_body: errorInfo+"序列号与单位关联失败，如果您有任何疑问，可以点击页面下方的发起会话按钮。"
            })

          }

        }
      }
    })
  },

})

