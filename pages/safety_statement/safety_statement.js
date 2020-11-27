// pages/safety_statement/safety_statement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_text:'保存',
    isConfirmed:false,
    toConfirmed:0,
    needConfirm:true,
    showSignature:false,
    isSignatured: false,
    objectid:'',
    signatureImg:'',
    stateList:[
      {
        id:0,
        value:'血液，体液(如尿液、分泌物等)病理标本',
        checked:false
      },
      {
        id:1,
        value:'传染性物质或其他生物制剂(如蛋白质、酶、抗体)管制医疗废物 放射性物质(如ECD，同位素等)',
        checked:false
      },
      {
        id:2,
        value:'对人体有害的化学物质',
        checked:false
      },
      {
        id:3,
        value:'可成为有害的可生物降解材料',
        checked:false
      },
      {
        id:4,
        value:'其他有害物质',
        checked:false
      },
      {
        id:5,
        value:'无任何有害物质',
        checked:false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('isConfirmed:',options);
    this.data.objectid=options.objectid;
    if(typeof(options.toConfirmed)!='undefined'){
      this.setData({
        toConfirmed:options.toConfirmed
      })
    }  
    var that=this;
    util.NetRequest({
      url: 'api/v1/sr/bq?objectid=' + this.data.objectid,
      method: 'GET',
      success: function (r) {
        console.log(r);
        if (r.data.status != false) {
          that.setData({
            pageComplete: true,
            pageShow: false,
            isConfirmed: r.data.is_confirmed
          })
        } 
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
    // 签名
    toSignature:function(){
      this.setData({
        showSignature:true
      })
    },
     // 关闭签名
  closeSignature:function(){
    this.setData({
      showSignature:false
    })
  },
  // 完成签名
  completeSignature: function (e) {
    console.log('completeSignature:', e);
    this.setData({
      showSignature: false,
      isSignatured: true,
      signatureImg: e.detail
    })
  },
  submit:function(e){
    var that=this;
    if(that.data.toConfirmed){
      
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})