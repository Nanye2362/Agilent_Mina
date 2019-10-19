var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        case1:false,
        case2:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.type == 1){ //未解决，其他
            this.setData({
                case1: true,
                case2:false
            })
        }else if(options.type == 2){ //已解决
            this.setData({
                case1: false,
                case2:true
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
        var sysinfo = app.globalData.sysInfo;
        this.setData({
            width: (sysinfo.winWidth * 0.8) +'px',
            height:(sysinfo.winWidth * 0.8  * 1.1)+'px'
        })
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

    },

    okTap:function () {
        wx.switchTab({
            url:'../../index/index'
        })
    }
})
