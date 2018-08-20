// components/component-tag-name.js
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
    showInfo: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    questionDetails: function(){
      console.log('component function');
      this.setData({
        showInfo: !this.data.showInfo,
      })
    }
  }
})
