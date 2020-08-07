var util = require('../../../utils/util.js');
var app = getApp();
//获取报价单状态
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow:false,
        case1:false,
        case2:false,
        case3:false,
        modalShow:false,
        srId:'',
        objectId:'',
        isConfirm:0,
        group:'',
        pushId:'',
        content:'',
        textContent:'',
        dpId:'',
        titleContent:'',
        transferAction:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        _this.pushId = options.dpId;
        _this.setData({
            dpId:_this.pushId
        });
        app.mta.Page.init();
        if(options.type == 1){ //跳转到选择确认报价页面
            _this.setData({
                case1:true,
                case2:false,
                case3:false
            });

            util.NetRequest({
                url: 'directional-push/get-offer-status',
                data: {
                    pushid: _this.pushId
                },
                success: function (res) {
                    if(res.success == 0){
                        _this.setData({
                            srId:res.data.srid,
                            objectId: res.data.objectid,
                            isConfirm:res.data.isConfirm,
                            group:res.data.group,
                            pushId:_this.pushId
                        });
                        if(res.data.isConfirm == 1){
                            _this.setData({
                                titleContent:'您已确认报价',
                                case1:false,
                                case2:false,
                                case3:true,
                            })
                        }else if(res.data.isConfirm == -1){
                            _this.setData({
                                titleContent:'您已取消报价',
                                case1:false,
                                case2:false,
                                case3:true,
                            })
                        }
                    }
                }
            });
            return false;
        }else if(options.type == 2){ //跳转到立即与在线客服联系页面
            _this.setData({
                case1:false,
                case2:true,
                case3:false,
                isShow:true
            });

            util.NetRequest({
                url: 'directional-push/is-issue-solve',
                data: {
                    pushid: _this.pushId
                },
                success: function (res) {
                    if(res.success == 0){
                        _this.setData({
                            group:res.data.group
                        });
                    }
                }
            })
        }

        // util.NetRequest({
        //     url: 'wechat-mini/get-global-group',
        //     success: function (res) {
        //         app.globalData.sobotData = res.data;
        //         util.getUserInfoSobot(function () {
        //             _this.setData({
        //                 isShow:true
        //             });
        //         });
        //         _this.setData({
        //             transferAction:util.sobotTransfer(4)
        //         });
        //     }
        // });
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

    MtaReport: function () {
        app.mta.Event.stat("meqia", { "group": this.group });
    },

    //取消
    closeTap:function(){
        this.setData({
            modalShow : true
        })
    },

    //确认
    confirmTap:function(){
        var _this = this;
        util.NetRequest({
            url: 'directional-push/submit-confirm',
            data: {
                pushid: _this.pushId,
                code:1
            },
            success: function (res) {
                if(res.success == 0){
                    wx.redirectTo({
                        url:'../../budget_confirm/budget_confirm?srId='+_this.data.srId+'&objectId='+_this.data.objectId
                    })
                }
            }
        })

    },

    infoOkTap:function(){
        var _this = this;
        util.NetRequest({
            url: 'directional-push/submit-confirm',
            data: {
                pushid: _this.data.pushId,
                code:2,
                reason:_this.data.textContent
            },
            success: function (res) {
                if(res.success == 0){
                    wx.switchTab({
                        url:'../../index/index'
                    })
                }
            }
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

    infoCancelTap:function () {
        this.setData({
            modalShow : false
        })
    },

    bindTextAreaBlur:function (e) {
        this.setData({
            textContent: e.detail.value
        })
    },

    toIndex:function () {
        wx.switchTab({
            url:'../../index/index'
        })
    }
})
