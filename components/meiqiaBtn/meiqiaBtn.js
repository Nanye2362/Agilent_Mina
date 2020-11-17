// components/meiqiaBtn/meiqiaBtn.js
var workTime = require('../../utils/workTime.js');
var util = require('../../utils/util.js');
var config = require('../../config.js');


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    handleAlert:{
      type: Boolean,
      value:false
    },
    sessionFrom:String,
    meqiaGroup:String,
    disabled:String,
    formType:String,
    robotid:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isWork:true,
    showModal:false,
    canUse:true,
    params: '',
    nickName:'',
    avatarUrl:'',
    contactId:'',
    sessionFromFormat:"",
    sobotFrom:""
  },

  lifetimes: {
    attached: function() {
      this.setData({
        nickName: wx.getStorageSync("sobot_nickname"),
        avatarUrl:wx.getStorageSync("sobot_avatarUrl"),
        contactId:wx.getStorageSync("sobot_contactid"),
        miniOpenId:wx.getStorageSync("mini_openid"),
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    meiqiaBtnTap:function(e){
      var robotid = 1;
      if(this.data.robotid != undefined){
        robotid = this.data.robotid
      }

      if (!this.data.canUse){
        this.setData({
          showModal:true
        })
      }else{
        var url = config.sobotUrl;

        var param = {
          "name" : this.data.nickName,
          "contactId" : this.data.contactId,
          "from" : this.data.sobotFrom,
          "transAction" : this.data.sessionFromFormat,
        };
        var paramJson = JSON.stringify(param);
        var transfer_action = this.data.sessionFromFormat

        let searchParams = {
          sysnum : config.sobotSysnum,
          partnerid : this.data.miniOpenId,
          uname : this.data.nickName,
          face: this.data.avatarUrl,
          params: paramJson,
          transfer_action : transfer_action,
          robotid : robotid,
          top_bar_flag:1
        }

        Object.keys(searchParams).map((key)=>{
          url += key + '=' + searchParams[key] +'&';
        })
        url = url.substring(url.length-1,-1)
        url = url.replace(/transferAction=/g, "")
        url = encodeURI(url);
        wx.setStorage({
          key: "sobotHtmlUrl",
          data: url,
          success: function () {
            wx.navigateTo({
              url: '/pages/sobot_html/openHtml',
            });
          }
        })

      }
    }
  },
  externalClasses: ['btn-class'],
  attached:function(){
     let that=this;
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
  detached:function(){
    /*workTime.removeHandleArr(this.__wxExparserNodeId__);*/
  },
  observers: {
    'sessionFrom'(value) {

      var _this = this;
      _this.setData({
        sessionFromFormat: ''
      });

      var strArr = [];
      strArr = value.split('|');
      this.setData({
        sobotFrom: strArr[0]
      });

      console.log('sessionFrom value:',value);

      this.setData({
        sessionFromFormat: strArr[1]
      });

      console.log('session:'+this.data.sessionFromFormat);
    },
  }

})
