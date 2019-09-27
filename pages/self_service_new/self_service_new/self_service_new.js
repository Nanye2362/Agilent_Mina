var app = getApp();
var config = require('../../../config');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        menuList:[
            {color:'#00A9E0',text:"场地准备",url:'/pages/self_service_new/self_service_index/self_service_index?id=1'},
            // {color:'#84BD00',text:"现场培训教材",url:'/pages/self_service_new/self_service_index/self_service_index?id=2'},
            {color:'#008522',text:"视频集锦",url:'/pages/html/openHtml'},
            {color:'#00BAB3',text:"常见问题",url:'/pages/self_service/self_service'}
        ]
    },
    toPage: function (e) {
        if(e.currentTarget.dataset.title == '视频集锦'){
            wx.setStorage({
                key: "openHtmlUrl",
                data: config.Server +'/site/video-collection-index',
                success: function () {
                    wx.navigateTo({
                        url: '../../html/openHtml',
                    });
                }
            })
            return false;
        }

        wx.navigateTo({
            url:e.currentTarget.dataset.url
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
            width: (sysinfo.winWidth * 0.7) +'px',
            height:(sysinfo.winWidth * 0.7  * 1.1)+'px'
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

    }
})
