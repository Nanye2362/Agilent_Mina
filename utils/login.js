var requestApi = require('request');
var config = require('../config');
var util = require('util');

function login(params) {
  console.log('params:',params);
  var that = params;
  that.globalData.syncFlag = true;
  wx.login({
    success: function (res) {
      console.log(res);
      if (res.code) {
        //发起网络请求
        util.NetRequest({
          url: 'api/v1/wechat/login',
          data: {
            code: res.code,
            userMobile: JSON.stringify(that.userMobile)
          },
          showload: true,
          success: function (response) {
            console.log('login:',response);
            that.globalData.isLoading = false;            
            var pages = getCurrentPages(); //获取加载的页面
            var currentPage = pages[pages.length - 1]; //获取当前页面的对象  
            if (response.status == true) {
              that.globalData.needCheck = false;
              wx.setStorageSync('token', response.data.token);
              wx.setStorageSync('MOBILE', response.data.mobile);
              wx.setStorageSync('OPENID', response.data.openid);
              that.globalData.isLogin = true;
              //that.gotoIndex();
              that.globalData.syncFlag = false;
              if(currentPage.route == 'pages/initiate/initiate'){
                wx.switchTab({
                  url: '/pages/index/index',
                });
              }         
              // util.NetRequest({
              //   url: 'wechat-mini/get-global-group',
              //   showload: false,
              //   success: function (res1) {
              //     that.globalData.sobotData = res1.data;
              //     wx.switchTab({
              //       url: '/pages/index/index',
              //     });
              //   }
              // });

            }else {
              that.globalData.needCheck = true;
              that.globalData.isFollow = false;
              wx.setStorageSync('AuthFromPage',currentPage.route );
              wx.redirectTo({
                url: '/pages/login/login'
              });
            }
          },
          fail:function(){
            login();
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}
module.exports = {
  login
}