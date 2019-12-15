// components/meiqiaBtn/meiqiaBtn.js
var workTime = require('../../utils/workTime.js');
var util = require('../../utils/util.js');


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
    formType:String
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
    sessionFromFormat:""
  },

  lifetimes: {
    attached: function() {
      this.setData({
        nickName: wx.getStorageSync("sobot_nickname"),
        avatarUrl:wx.getStorageSync("sobot_avatarUrl"),
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    meiqiaBtnTap:function(e){

      if (!this.data.canUse){
        this.setData({
          showModal:true
        })
      }else{
        workTime.handleWorkTime(this.data.handleAlert);
        this.triggerEvent('meiqiaTap', e);
        console.log('meiqiaBtnTap', e)
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
    'sessionFrom': function (value) {
      var _this = this;
      _this.setData({
        sessionFromFormat: ''
      });
      var strArr = value.split('|');

      strArr[0] = '"' + strArr[0].replace(/\"/g, "")+'"'

      _this.setData({
        sessionFromFormat: strArr.join("|")
      });

      console.log('session:'+this.data.sessionFromFormat);
    },
  }

})
