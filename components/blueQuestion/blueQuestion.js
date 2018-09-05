// components/blueQuestion/blueQuestion.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    displayTips: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTips:function(){
      var pages = getCurrentPages();
      var _this = pages[pages.length - 1];
      _this.setData({
        showTextarea: !_this.data.showTextarea,
      })
      var displayTips = this.data.displayTips;
      console.log('showtips')
      this.setData({
        displayTips: !displayTips
      })
    },
  }
})
