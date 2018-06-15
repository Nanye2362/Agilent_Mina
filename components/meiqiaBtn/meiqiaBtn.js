// components/meiqiaBtn/meiqiaBtn.js
var workTime = require('../../utils/workTime.js');


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
    meqiaGroup:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isWork:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    meiqiaBtnTap:function(e){
      workTime.handleWorkTime(this.data.handleAlert);
      this.triggerEvent('meiqiaTap', e);
    }
  },
  externalClasses: ['btn-class'],
  attached:function(){
     let that=this;
     workTime.startWorkTime(function(workTimeStatus){
       console.log("-----meiqiaBtn setData isWork " + workTimeStatus+" ------");
       that.setData({
         isWork: workTimeStatus
       })
     });
  }
})
