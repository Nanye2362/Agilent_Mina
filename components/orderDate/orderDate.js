// components/orderDate/orderDate.js
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的初始数据
   */
  data: { 
    //日期
    openDate: false,
    dayList:['日','一','二','三','四','五','六'],
    chooseDate:'请选择您期望预约的日期',
  },
  attached: function () { 
    var app = getApp();
    this.setData({
      dateWidth: app.globalData.sysInfo.dateWidth,
    })
    this.orderDate();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //日期
    orderDate: function(){
      var that = this;
      util.NetRequest({
        url: 'util/api-get-worktime',
        data: {
        },
        success: function (res) {
          console.log(res);
          var dateArry = [];
          var firstDay = '';
          var year = '';
          for(var i in res){
            var obj = {};
            obj.date = i.substring(i.length-2);
            obj.year = i.substring(0,4);
            obj.month = i.substr(4,2);
            obj.optional = res[i];
            if(obj.optional==0 && firstDay ==''){
              firstDay = 'firstDay';
              year = i.substring(0, 4);
              obj.firstDay = 'firstDay';
            }
            dateArry.push(obj);
          }
          console.log(firstDay);
          var addDateNo = 35-dateArry.length;
          var lastValue = dateArry[dateArry.length-1].date;
          console.log(dateArry);
          that.setData({
            dateList: dateArry,
            theYear: year,
          })
        },
        fail: function (err) {
          console.log(err);
        }
      })
    },
    chooseDate: function(e){
       var pages = getCurrentPages();
       var _this = pages[pages.length - 1];
       var chooseDate = e.currentTarget.dataset.date;
       var optional = e.currentTarget.dataset.optional;
       if(optional==0){
         this.setData({
           chooseDate: chooseDate,
         })
         _this.setData({
           chooseDate: chooseDate,
         })
         this.openDate();
       }else{
          return false;
       }
    },
    openDate:function(){
      var pages = getCurrentPages();
      var _this = pages[pages.length - 1];
      _this.setData({
        showTextarea: !_this.data.showTextarea,
      })
      this.setData({
        openDate: !this.data.openDate,
      })
    },

  /**
   * 组件的属性列表
   */
  properties: {

  },
  }
})
