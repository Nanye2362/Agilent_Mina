// pages/invoice_list/invoice_list.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTypeModal: false,
    currentIdx: 0,
    invoiceList: [],
    invoiceTypeList: [
      { name: '0', value: '增值税普通发票' },
      { name: '1', value: '增值税专用发票' },
    ],
    currentInvoiceId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('发票列表options：', options);
    if(typeof (options.invoiceId) != 'undefined'){
      this.data.currentInvoiceId=options.invoiceId;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    that.getInvoiceList();
  },
  getInvoiceList() {
    var that=this;
    util.NetRequest({
      url: 'api/v1/user/invoice-list',
      method: 'GET',
      success: function (r) {
        console.log('发票list:', r);
        var invoiceList=r.data.list;
        if(that.data.currentInvoiceId!=''){
          for(let i in invoiceList){
            if(invoiceList[i].id==that.data.currentInvoiceId){
              that.setData({
                currentIdx:i
              })
            }
          }
        }
        that.setData({
          invoiceList: invoiceList
        })
      }
    })
  },
  // 去编辑某个发票
  toEdit(e) {
    console.log('去编辑某个发票:', e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../invoiceConfirm/invoiceConfirm?invoiceId=' + id
    })
  },
  // 删除某个发票
  toDelete(e) {
    console.log('删除某个发票:', e);
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除该发票？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          util.NetRequest({
            url: 'api/v1/user/invoice/' + id,
            method: 'DELETE',
            success: function (r) {
              console.log('删除某个发票res:', r);
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              that.getInvoiceList();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 选中某个发票
  selectInvoice: function (e) {
    console.log('selectInvoice:', e);
    if (this.data.currentIdx == e.currentTarget.dataset.current) {
      return
    } else {
      this.setData({
        currentIdx: e.currentTarget.dataset.current
      })
    }
  },
  // 新增发票弹窗显示
  showInvoiceType: function () {
    this.setData({
      showTypeModal: !this.data.showTypeModal,
    })
  },
  // 选择新增发票类型
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var currentInvoice;
    var title = wx.getStorageSync('sobot_company');

    if (e.detail.value == 0) {
      currentInvoice = 'normalInvoice';
    } else {
      currentInvoice = 'specialInvoice';
    };

    wx.navigateTo({
      url: '../invoiceDetails/invoiceDetails?currentInvoice=' + currentInvoice + '&title=' + title + '&isAddInvoice=1'
    })
    this.showInvoiceType();
  },
  submit(e) {
    console.log('选中的发票：', this.data.invoiceList[this.data.currentIdx]);
    var that = this;
    var pages = getCurrentPages();
    var nums;
    for (var i in pages) {
      if (pages[i].route == 'pages/invoice_confirm_info/invoice_confirm_info'||pages[i].route == 'pages/budget_confirm/budget_confirm') {
        pages[i].setData({
          invoiceInfo: that.data.invoiceList[this.data.currentIdx]
        })
        nums = parseInt(i) + 1;
      }
    }
    wx.navigateBack({
      delta: pages.length - nums
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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