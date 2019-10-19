/**
 * 图片预加载组件
 */
Component({
  properties: {
    //默认图片
    defaultImage: String,
    //原始图片
    originalImage: String,
    width: String,
    //图片链接地址
    imgLink: String,
    //图片地址
    imgSrc:String,
    // height: String,
    //图片剪裁mode，同Image组件的mode
    mode: String
  },
  data: {
    finishLoadFlag: false
  },
  methods: {
    bindtap:function(e){
      this.triggerEvent('imageTap', e); 
    },
    
    finishLoad: function (e) {
      console.log('1111122222'),
      this.setData({
        finishLoadFlag: true
      })
    }
  },
  externalClasses: ['img-class']
})
