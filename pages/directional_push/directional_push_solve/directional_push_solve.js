var util = require('../../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        case1: false,
        isConfirm: false,
        number: '',
        content: '',
        textContent: '',
        date: '',
        modalShow: false,
        dpId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        _this.pushId = options.dpId; //推送id
        _this.setData({
            dpId: _this.pushId
        });

        app.mta.Page.init();
        util.NetRequest({
            url: 'directional-push/is-issue-solve?pushId=' + _this.pushId,
            method: 'GET',
            success: function (res) {
                if (res.status) {
                    if (res.data.isConfirm == 1) {
                        wx.redirectTo({
                            url: '../directional_push_submit/directional_push_submit?type=2'
                        });
                        return false;
                    }
                    if (res.data.isConfirm == -2) {
                        wx.redirectTo({
                            url: '../directional_push_submit/directional_push_submit?type=1'
                        });
                        return false;
                    }

                    _this.setData({
                        number: res.data.number,
                        content: res.data.content,
                        date: res.data.date,
                        isConfirm: res.data.isConfirm,
                        group: res.data.group
                    })
                }
            }
        });
        util.NetRequest({
            url: 'api/v1/wechat/get-global-group',//wechat-mini/get-global-group
            method: "GET",
            success: function (res) {
                app.globalData.sobotData = res.data;
                util.getUserInfoSobot(function () {
                    _this.setData({
                        case1: true
                    });
                });
                _this.setData({
                    transferAction: util.sobotTransfer(6)
                });
            }
        });
    },
    MtaReport: function () {
        app.mta.Event.stat("meqia", { "group": this.group });
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
            width: (sysinfo.winWidth * 0.8) + 'px',
            height: (sysinfo.winWidth * 0.8 * 1.1) + 'px'
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

    //已解决
    solveTap: function () {
        var _this = this;
        util.NetRequest({
            url: 'directional-push/submit-confirm',
            data: {
                pushid: _this.pushId,
                code: 1
            },
            success: function (res) {
                if (res.status) {
                    wx.redirectTo({
                        url: '../directional_push_submit/directional_push_submit'
                    })
                }
            }
        })
    },

    bindTextAreaBlur: function (e) {
        console.log(e.detail.value);
        this.setData({
            textContent: e.detail.value
        })
    },

    noSolveTap: function () {
        this.setData({
            modalShow: true
        })
    },

    infoCancelTap: function () {
        this.setData({
            modalShow: false
        })
    },

    infoOkTap: function () {
        var _this = this;
        util.NetRequest({
            url: 'directional-push/submit-confirm',
            data: {
                pushId: _this.pushId,
                code: -2,
                reason: _this.data.textContent
            },
            success: function (res) {
                if (res.status) {
                    wx.redirectTo({
                        url: '../directional_push_submit/directional_push_submit?type=1'
                    })
                }
            }
        })
    }
})
