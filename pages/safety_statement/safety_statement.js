// pages/safety_statement/safety_statement.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSafty: false,//有无勾选有害物质
    pageShow: false,//有无权限
    pageComplete: false,
    btn_text: '保存',
    showBackendSignature: false,
    isConfirm: 0,
    toConfirmed: 0,
    needConfirm: true,
    showSignature: false,
    isSignatured: false,
    objectid: '',
    signatureImg: '',
    valuesList: [],
    stateList: [
      {
        id: 0,
        value: '血液，体液(如尿液、分泌物等)病理标本',
        checked: false
      },
      {
        id: 1,
        value: '传染性物质或其他生物制剂(如蛋白质、酶、抗体)管制医疗废物',
        checked: false
      },
      {
        id: 2,
        value: '放射性物质(如ECO，同位素等)',
        checked: false
      },
      {
        id: 3,
        value: '对人体有害的化学物质',
        checked: false
      },
      {
        id: 4,
        value: '可成为有害的可生物降解材料',
        checked: false
      },
      {
        id: 5,
        value: '无任何有害物质',
        checked: false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('健康安全声明options:', options);
    this.data.objectid = options.objectId;
    var that = this;
    if (typeof (options.toConfirmed) != 'undefined') {
      this.setData({
        toConfirmed: options.toConfirmed
      })
      util.NetRequest({
        url: 'api/v1/sr/bq?objectid=' + this.data.objectid,
        method: 'GET',
        success: function (r) {
          console.log(r);
          if (r.data.status != false) {
            if (r.data.is_confirmed) {
              if (typeof (r.data.safety_statement) != 'undefined') {
                that.setData({
                  stateList: r.data.safety_statement
                })
              }
            }
            if (typeof (r.data.bq_confirmed_id) != 'undefined' && r.data.bq_confirmed_id != '') {
              console.log('已确认id：', r.data.bq_confirmed_id)       
              let is_confirmed=r.data.is_confirmed;
              var token = wx.getStorageSync('token');
              let url=util.Server+'api/v1/sr/bq/sign-img?bq_confirmed_id=' + r.data.bq_confirmed_id;
              console.log(url);
              wx.showLoading({
                title: '加载中，请稍候',
                mask: true
              })
              const downloadTask1 = wx.downloadFile({
                url: url,
                header: {
                  'Authorization': "Bearer " + token
                },
                success: function (res) {
                  console.log(res);
                  console.log('filePath= ' + res.tempFilePath);
                  if(res.tempFilePath){
                    that.setData({
                      showBackendSignature: true,
                      signatureImg: res.tempFilePath,
                      isSignatured: true,
                      checkBox: is_confirmed
                    })
                  }                        
                },
                complete: function complete() {
                  wx.hideLoading();
                },
                fail: function fail() {
                  wx.showModal({
                    title: '提示',
                    content: '签名生成中',
                    showCancel: false
                  });
                }
              })
              
            }
            that.setData({
              pageComplete: true,
              pageShow: true,
              isConfirm: r.data.is_confirmed
            })
          } else if (r.data.status == false) {
            //  只能查看不能确认
            that.setData({
              pageComplete: true,
              pageShow: false,
              isConfirm: r.data.is_confirmed
            })
          }

        }
      })
    } else {
      that.setData({
        pageComplete: true,
        pageShow: true
      })
    }

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
    var items = this.data.stateList;
    var values = e.detail.value;
    // 最新选中的为“无害物质”则其他都不能选
    if (values[values.length-1] == 5) {
      items[0].checked = false;
      items[1].checked = false;
      items[2].checked = false;
      items[3].checked = false;
      items[4].checked = false;
      items[5].checked = true;
      this.data.hasSafty = false;
    }else{
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        if (values.length > 0) {
          for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
            console.log('checkbox选中数组');
            items[i].checked = false;
            if (items[i].id == values[j]) {
              items[i].checked = true
              this.data.hasSafty = true;// 判断是否勾选了有害物质
              // 如果选择“无任何有害物质”，其他选项均为未选中
              if (values[j] == 5&&j!=values.length-1) {
                items[i].checked = false
              }
              break
            }
          }
        } else {
          items[0].checked = false;
          items[1].checked = false;
          items[2].checked = false;
          items[3].checked = false;
          items[4].checked = false;
          items[5].checked = false;
          this.data.hasSafty = false;
  
        }
      }
    }
   


    this.setData({
      stateList: items,
      hasSafty: this.data.hasSafty
    })
    this.data.valuesList = values;
    console.log('checkbox发生change事件stateList:', this.data.stateList);
  },
  // 签名
  toSignature: function () {
    this.setData({
      showSignature: true
    })
  },
  // 关闭签名
  closeSignature: function () {
    this.setData({
      showSignature: false
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
  submit: function (e) {
    var that = this;
    console.log('that.data.valuesList:', that.data.valuesList);
    console.log('提交的safety_statement:', that.data.stateList);

    if (that.data.valuesList.length <= 0) {
      wx.showModal({
        title: '提交失败',
        content: '请确认勾选对应的安全声明',
        showCancel: false
      })
      return false;
    }
    if (that.data.toConfirmed == 1) {
      //上传签名并确认安全声明
      if (that.data.signatureImg == '') {
        wx.showModal({
          title: '提交失败',
          content: '请确认签字',
          showCancel: false
        })
        return false;
      } else {
        let url = 'api/v1/sr/fill-safety-statement   ';
        var params = {
          objectid: that.data.objectid,
          safety_statement: JSON.stringify(that.data.stateList),
        };
        util.uploadFileRequest({
          url: url,
          data: params,
          filePath: that.data.signatureImg,
          fileName: 'signature',
          success: function (res) {
            console.log('上传签名并确认安全声明成功后：', res);
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            wx.switchTab({
              url: '../index/index',
            })
          }
        })
      }
    } else {
      var pages = getCurrentPages();
      var nums;
      for (var i in pages) {
        if (pages[i].route == 'pages/repair_budget_confirm/repair_budget_confirm') {
          pages[i].setData({
            safety_statement: that.data.stateList,
            objectid: that.data.objectid
          })
          nums = i + 1;
        }
      }
      wx.navigateBack({
        delta: pages.length - nums
      })
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