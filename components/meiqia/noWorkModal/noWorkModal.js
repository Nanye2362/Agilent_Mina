// components/meiqia/noWorkModal/noWorkModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    system_text: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ModalSkipUrl: function () { //模态跳转离线
      wx.navigateTo({
        url: '/pages/leave_message/leave_message',
      })
    },
    ModalCalling: function () { //模态拨打手机
      wx.makePhoneCall({
        phoneNumber: '4008203278' //仅为示例，并非真实的电话号码
      })
    },
    modalConfirm: function () {
      this.setData({
        "showModal": false
      })
    },
  }
})
