var app = getApp()
Page({
    data: {
        date: '2016-11-08',
        time: '12:00',
        array: ['', '', '', ''],
        index: 0,
    },

    onLoad: function () {

    },
    // 点击时间组件确定事件 
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    // 点击日期组件确定事件 
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    // 点击国家组件确定事件 
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    }
}) 