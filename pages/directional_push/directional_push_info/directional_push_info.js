var app = getApp();
var config = require('../../../config');
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow:false,
        srId:'',
        transferAction:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.mta.Page.init();

        this.setData({
            srId:options.srId,
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
        var sysinfo = app.globalData.sysInfo;
        this.setData({
            width: (sysinfo.winWidth * 0.7) +'px',
            height:(sysinfo.winWidth * 0.7  * 1.1)+'px'
        })
        var that = this;
        util.NetRequest({
            url: 'api/v1/wechat/get-global-group',//wechat-mini/get-global-group
            method:"GET",
            success: function (res) {
                app.globalData.sobotData = res.data;
                util.getUserInfoSobot(function () {
                    that.setData({
                        isShow:true
                    });
                });
                that.setData({
                    transferAction:util.sobotTransfer(6)
                });
            }
        });
    },
    MtaReport: function () {
        console.log(1);
        app.mta.Event.stat("meqia", { "group": '1' });
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

    jumpOtherQuestion:function () {
        wx.navigateTo({
            url:'../../self_service/self_service'
        })
    },
    jumpVideo:function () {
        var url = config.Server+'site/video-collection-index';
        wx.setStorage({
            key: 'openHtmlUrl',
            data:url
        });
        wx.navigateTo({
            url:'../../html/openHtml'
        })
    }
})
