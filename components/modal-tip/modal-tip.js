// components/modal-tip/modal-tip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    showRightBtn:{
      type: Boolean,
      value: false
    },
    okBtnText:String,
    rightBtnText:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    okBtnText:'返回首页',
    rightBtnText:'确认发票信息'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      this.setData({show: false}) 
    },
    leftTap(){
      this.setData({ show: false })
      this.triggerEvent('leftTap')
    },
    rightTap() {
      this.setData({ show: false })
      this.triggerEvent('rightTap')
    },

    okTap() {
      this.setData({ show: false })
      wx.switchTab({
        url: '../index/index',
      })
      this.triggerEvent('confirm')
    }
  },
  externalClasses: ['modalContentClass']
})
