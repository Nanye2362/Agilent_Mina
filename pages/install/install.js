// pages/install/install.js
var util = require('../../utils/util.js');
var config = require('../../config.js');
var isSend=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatarUrl: '',
    transferAction: '',
    uploadBtn: true,
    photoURL: [],
    hasError:false,
    WLA: 'W',
    insType: ['气相色谱','气质联用','液相色谱','液质联用','溶出度仪','紫外光谱','红外光谱','原子光谱','ICP-OES','ICP-MS','其他'],
    pickerType: -1,
    desc:'',
    chooseDate: '',
    orderno:'',
    chooseCheckbox:[],
    showTextarea: true,
    imgUrl: config.Server +'images/install_bg.jpg',
    shVideo:false,
    curr_id:-1,
    playId:'',
    videoUrls: [
      {
        id: 1,
        poster: '/images/cover.jpg',
        title: '气相色谱场地准备视频',
        url: 'https://download.chem.agilent.com/videos/Agilent-GC-Site-PrepVideo-English_920x518.mp4',
      },
      {
        id: 2,
        poster: '/images/cover.jpg',
        title: '液相色谱场地准备视频',
        url: 'https://download.chem.agilent.com/videos/Agilent-LC-Site-PrepVideo-English_920x518.mp4',
      },

    ]
  },
  //选择仪器类型
  bindPickerChange: function(e){
    console.log(e);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pickerType: e.detail.value
    })
  },
  //多选框
  checkboxChange: function (e) {
    var chooseCheckbox = e.detail.value;
    console.log(chooseCheckbox);
    this.setData({
      chooseCheckbox: chooseCheckbox,
    })
  },
  
  //附加信息
  desNo: function (e) {
    this.setData({
      desc: e.detail.value 
    });
  },
  //场地安装就绪
  installReady: function(){
    var that = this;
    console.log('clickInstall')
    if (that.data.pickerType!=-1){
      wx.setStorage({
        key: "openHtmlUrl",
        data: "https://www.agilent.com/search/?Ntt=" + encodeURI(that.data.insType[that.data.pickerType] + '场地'),
        //data: "https://devops.coffeelandcn.cn/files/5990-6321CHCN.pdf",
        success: function () {
          wx.navigateTo({
            url: '../html/openHtml',
          });
        }
      })
    }   
  },
  skipToVideo:function(e){
    console.log('------dianji---',e)
    var playId = this.data.playId;
    // var shVideo = this.data.shVideo;
    this.setData({
      shVideo:true,
      showTextarea:false
    })
    var that=this;
    
    if (that.data.pickerType==0){
      that.setData({
        playId:0,
        // shVideo:true
      })
    }else{
      that.setData({
        playId: 1,
        // shVideo: true
      })
    }
  },

  cancelTap: function () {
    this.setData({
      shVideo: false,
      showTextarea:true,
      playId: '', 
      curr_id:-1
    })
  },

  //视频播放
  videoPlay: function (event) {
    console.log('videoplay----')
    console.log(event);
    var videoId = event.currentTarget.dataset.vid;
    console.log(videoId)
    var that = this;
    that.setData({
      curr_id: event.currentTarget.dataset.id,
    })
    wx.getStorage({
      key: videoId,
      success: function (res) {
        console.log("获取缓存成功！");
        console.log(res.data)
        that.videoContext.seek(res.data);
      }
    })
    //that.videoContext.play()
  },
  //页面滑动暂停视频播放
  handletouchmove: function () {
    this.setData({
      curr_id: '',
    })
    this.videoContext.pause()
  },
  //视频续播
  goOnVideo: function (event) {
    
    var detail = event.detail;
    var videoId = event.currentTarget.dataset.vid;
    wx.setStorage({
      key: videoId,
      data: detail.currentTime,
      success(res) {
        console.log("保存成功！")
      }
    })
  },

  formSubmit: function (e) {
    var clickevent = e.detail.target.dataset.click;
    console.log(e.detail.formId);
    util.submitFormId(e.detail.formId);
    this[clickevent](e.detail.target);
  },

  MtaReport: function () {
    var app = getApp();
    app.mta.Event.stat("meqia", { "group": 'WLA' });
  },

  blurfun: function (event) {
    this.setData(JSON.parse('{"' + event.target.dataset.name + '":"' + event.detail.value + '"}'));
  },
  ordercheck:function(event){
    var _orderno=event.detail.value
    if (!this._ordercheck(_orderno)){
      this.setData({ hasError: true })
    }else{
      this.setData({ hasError: false })
    }
  },
  _ordercheck: function (_orderno){
    var reStart = /^03(\d*)$/;
    if (_orderno != '' &&(_orderno.length!=10 || !reStart.test(_orderno) || _orderno.length==0)) {
          return false;
    }
    return true;
  },
  submit: function (event) {
    var URLArr = this.data.photoURL;
    var that = this; 
    if (!this._ordercheck(this.data.orderno)){
      wx.showModal({
        title: '提示',
        content: '请确认信息输入完整',
        showCancel: false,
      })
      return;
    }
    if (util.checkEmpty(that.data, ['name', 'company', 'orderno']) || that.data.pickerType == -1 || that.data.chooseCheckbox.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请确认信息输入完整',
        showCancel: false,
      })
      return;
    }
    if (isSend) {
      return false;
    }
    isSend = true;
    wx.showLoading({
      title: '提交中，请稍候',
      mask: true
    })
    if (URLArr.length > 0) {
      // 上传图片
      util.uploadImg(URLArr, function (imgUrlList) {
        that._submit(imgUrlList);
      })
    } else {
      that._submit([]);
    }
  },
  _submit: function (imgUrlList) {
    var that = this;
    util.NetRequest({
      showload: false,
      url: "api/v1/reservation", 
      data: {
        type:0,
        expected_date: that.data.chooseDate,
        mobile:that.data.mobile,
        name: that.data.name,
        company: that.data.company,
        order_no: that.data.orderno,
        instrument_type: that.data.insType[that.data.pickerType],
        additional_information: that.data.desc,   
        images:[imgUrlList[0],imgUrlList[1],imgUrlList[2],imgUrlList[3]]
      }, fail:function(e){
        console.log(e);
        isSend=false;
      },success: function (res) {
        isSend=false;
        console.log(res);
        if (res.status) {
          wx.showModal({
            title: '提交成功',
            content: '您的安装申请已提交成功，服务调度中心将会与您联系确认服务时间以及工程师安排事宜',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                });
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '发生错误，请联系客服',
            showCancel: false
          })
        }
      }
    })
  },
  /* *
 *   点击删除图片 
  */
  clickToDelete: function (event) {
    console.log(event);
    var URLArr = this.data.photoURL;
    var index = event.target.dataset.index;
    URLArr.splice(index, 1);
    if (URLArr.length < 4) {
      this.setData({ uploadBtn: true })
    }
    this.setData({ photoURL: URLArr });
  },

  /*
  *  点击上传图片
  */
  chooseimage: function (event) {
    var _this = this;
    var app = getApp();
    app.globalData.isUploading = true;
    var URLArr = this.data.photoURL;
    console.log(URLArr);
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        app.globalData.isUploading = false;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        URLArr = URLArr.concat(res.tempFilePaths);
        console.log(URLArr);
        if (URLArr.length == 4) {
          _this.setData({ uploadBtn: false })
        }
        if (URLArr.length > 4) {
          wx.showToast({
            title: '图片大于4张，请重新上传',
            icon: 'loading',
            duration: 2000,
            mask: 'true'
          })
          return false;
        }
        _this.setData({
          photoURL: URLArr
        });
        console.log(_this.data.photoURL)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //腾讯mta统计开始
    var app = getApp();
    app.mta.Page.init();
    //腾讯mta统计结束
    var that = this;
    util.getUserInfo(function (user) {
      that.setData({
        name: user.name,
        company: user.company,
        mobile: user.mobile
      })
    });

    this.setData({
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl,
      transferAction: util.sobotTransfer(5)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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