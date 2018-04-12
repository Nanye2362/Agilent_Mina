// pages/service_guide/service_guide.js
var util = require('../../utils/util.js');
Page({
    data:{
      src: 'https://prd.wechat.service.agilent.com/info.mp4'  // video 的路径必须是网络地址
  //http://video.coffeelandcn.cn/0473f6bd08ed448e8febf4278cf8aba7/a1da215afada4c8ebbdd8d129318a77c-4b6ffae84f2e1d243955ecaedcf11a3e.m3u8
    },
    backHome: function () {
      util.backHome()
    },
    onload:function(){
      //腾讯mat统计开始
      var app = getApp();
      app.mta.Page.init();
    //腾讯mat统计结束
    }
})