// components/meiqiaBtn/meiqiaBtn.js
var workTime = require('../../utils/workTime.js');
var util = require('../../utils/util.js');
var config = require('../../config.js');


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    handleAlert: {
      type: Boolean,
      value: false
    },
    sessionFrom:String,
    meqiaGroup:String,
    disabled:String,
    formType:String,
    robotid:String,
    sobotType:String,
    contactType:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isWork: true,
    showModal: false,
    canUse: true,
    params: '',
    nickName: '',
    avatarUrl: '',
    contactId: '',
    sessionFromFormat: "",
    sobotFrom: ""
  },

  lifetimes: {
    attached: function () {
      this.setData({
        nickName: wx.getStorageSync("sobot_nickname"),
        avatarUrl: wx.getStorageSync("sobot_avatarUrl"),
        contactId: wx.getStorageSync("sobot_contactid"),
        miniOpenId: wx.getStorageSync("mini_openid"),
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    meiqiaBtnTap: function (e) {
      //咨询事件统计
      var contactType = ''; //咨询类型
      if(this.data.contactType != undefined){
        contactType = this.data.contactType
      }
      console.log('咨询类型：',contactType);
      wx.reportAnalytics('contact', {
        type: contactType,
      });
      var robotid = 1;
      var sobotType = ''; //接入类型
      //目前指定到1号机器人
      // if(this.data.robotid != undefined){
      //   robotid = this.data.robotid
      // }
      console.log('this.data.sobotType != undefined:',this.data.sobotType != undefined);
       if(this.data.sobotType != undefined){
         sobotType = this.data.sobotType
       }
       console.log('this.data.sobotType:',sobotType);
      if (!this.data.canUse){
        this.setData({
          showModal: true
        })
      } else {
      // 智齿原生会话
        console.log('美洽触发！！！！！')
        this.setData({
          sessionFromFormat: this.data.sessionFromFormat,
          isWork: true
        })
        console.log('sessionFromFormat', this.data.sessionFromFormat)
        this.triggerEvent('meiqiaTap', e);
        // 智齿H5
        // var url = config.sobotUrl;
        // var param = {
        //   "name": this.data.nickName,
        //   "contactId": this.data.contactId,
        //   "from": this.data.sobotFrom,
        //   "transAction": this.data.sessionFromFormat,
        // };
        // var paramJson = JSON.stringify(param);
        // var transfer_action = this.data.sessionFromFormat
        // console.log('paramJson:', paramJson);
        // let searchParams = {
        //   sysnum: config.sobotSysnum,
        //   partnerid: this.data.miniOpenId,
        //   uname: this.data.nickName,
        //   face: this.data.avatarUrl,
        //   params: paramJson,
        //   transfer_action : transfer_action,
        //   robotid : robotid,
        //   top_bar_flag:1,
        //   type:sobotType
        // }
        // console.log('searchParams:', searchParams);
        // Object.keys(searchParams).map((key) => {
        //   url += key + '=' + searchParams[key] + '&';
        // })
        // url = url.substring(url.length - 1, -1)
        // url = url.replace(/transferAction=/g, "")
        // url = encodeURI(url);

        // wx.navigateTo({
        //   url: '/pages/sobot_html/openHtml?url='+encodeURIComponent(url),
        // });

        // wx.setStorage({
        //   key: "sobotHtmlUrl",
        //   data: url,
        //   success: function () {
        //     wx.navigateTo({
        //       url: '/pages/sobot_html/openHtml',
        //     });
        //   }
        // })

      }
    }
  },
  externalClasses: ['btn-class'],
  attached: function () {
    let that = this;
    that.setData({
      isWork: true,
      canUse: true
    })
    /*workTime.startWorkTime(function (workTimeStatus, canUse){
      if (!canUse){
        workTimeStatus=false;
      }

       that.setData({
         isWork: workTimeStatus,
         canUse: canUse
       })
     }, this.__wxExparserNodeId__);*/
  },
  detached: function () {
    /*workTime.removeHandleArr(this.__wxExparserNodeId__);*/
  },
  observers: {
    'sessionFrom'(value) {
      // 智齿原生会话
      var _this = this;
      _this.setData({
        sessionFromFormat: ''
      });
      var strArr = value.split('|');

      var params = "{\"name\":\""+ _this.data.nickName+"\",\"contactId\":\""+ _this.data.contactId +"\",\"from\":\""+ strArr[0]+"\"}";
      strArr[0] = params;
      console.log('strArr:',strArr);
      console.log('sessionFrom value:',value);
      this.setData({
        sessionFromFormat: strArr.join("|")
      })
      // 智齿H5
      // var _this = this;
      // _this.setData({
      //   sessionFromFormat: ''
      // });   
      // var strArr = [];
      // strArr = value.split('|');
      // this.setData({
      //   sobotFrom: strArr[0]
      // });

      // console.log('sessionFrom value:', value);

      // this.setData({
      //   sessionFromFormat: strArr[1]
      // });

      console.log('session:' + this.data.sessionFromFormat);
    },
  }

})
