var workTime = require('../../utils/workTime.js');
var util=require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showType: String,
    handleAlert: {
      type: Boolean,
      value: false
    },
    needBind: {
      type: Boolean,
      value: false
    },
    sessionFrom: String,
    meqiaGroup: String,
    disabled: String,
    formType: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    canUse: true, //是否可用
    isWork: true, //是否工作时间
    showModal: false, //显示文字提醒
  },
  externalClasses: ['my-class','btn-class'],
  /**
   * 组件的方法列表
   */
  methods: {
    cp_Tap:function(e){
      console.log(this.data.needBind);
      var that=this;
      if (this.data.needBind){
        util.IsCertificate(function () {
          that.triggerFun(e);
        },function(){
          wx.navigateTo({
            url: '../auth/auth?pageName=index',
          })
        })
      }else{
        that.triggerFun(e);
      }

    },
    triggerFun:function(e){
      if (!this.data.canUse) {//先判断是否可用,不可用弹出模态
        this.setData({
          "showModal": true
        })
      } else {
        console.log(this.data.isWork);
        console.log(e);
        e.iswork = this.data.isWork;
        this.triggerEvent('clickevent', e);
      }
    }
  },
  attached: function () {
    let that = this;
    that.setData({
      isWork: true,
      canUse: true
    });
    /*workTime.startWorkTime(function (workTimeStatus,canUse) {
      console.log(canUse);
      that.setData({
        isWork: workTimeStatus,
        canUse: canUse
      })
    }, this.__wxExparserNodeId__);*/
  },
  detached: function () {
    /*workTime.removeHandleArr(this.__wxExparserNodeId__);*/
  }
})
