var config = require('../config');
var request = require('request');


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getUserInfoSobot(fun) {
  var that=this;
  setTimeout(function () {
    request.NetRequest({
      url: 'api/v1/wechat/sobot/user-info?check_vip=1',//site-mini/sobot-getuserinfo
      method:'GET',
      showload: false,
      success: function (res) {
        console.log(res);
        wx.setStorageSync('sobot_nickname', res.data.name);
        wx.setStorageSync('sobot_avatarUrl', res.data.avatarUrl);
        wx.setStorageSync('sobot_company', res.data.company);
        wx.setStorageSync('sobot_contactid', res.data.ContactId);
        if(typeof(fun)=="function"){
           fun();
        }
      }
    })
  }, 1000)
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let Server = config.Server; //UAT

//sobot传技能客服租逻辑2
//transferAction:
//'[{"actionType":"to_group","deciId":"xxx","optionId":"3","spillId":"4"},{"actionType":"to_group","deciId":"xxx","optionId":"4"}]'
function sobotTransfer(id) {
  var app = getApp();
  var r = app.globalData.sobotData;
  for(var i = 0; i < r.length; i++){
    if(r[i]['id'] == id){
      console.log('sobot-transfer:',r[i])
      return RtransferAction(r[i])
    }
  }

}

//sobot传技能客服组逻辑
function RtransferAction(r) {
  if (r == undefined || r == null) {
    return ''
  } else {
    console.log("进入")
    console.log(r)
    var result = []
    var keys = Object.keys(r)
    console.log(keys);
    if(keys.length <= 2) {
      return JSON.stringify(result);
    } else {
      var n = (keys.length -2) / 2;
      console.log(n)
      for (var i = 1; i < n; i++) {
        var gn_type = 'g' + `${i}` + '_type';
        console.log(gn_type);
        var gn = 'g' + `${i}`;
        var o = {};
        if (r[gn_type] == '1') {
          o["actionType"] = "to_group";
          o["deciId"] = r[gn];
          o["optionId"] = "3";
          o["spillId"] = '7';
        } else if (r[gn_type] == '2') {
          o["actionType"] = "to_service";
          o["deciId"] = r[gn];
          o["optionId"] = "1";
          o["spillId"] = '3';
        }
        result.push(o);
      }

      var o1 = {};
      var gn_type1 = 'g' + `${n}` + '_type';
      var gn1 = 'g' + `${n}`;

      if (r[gn_type1] == '1') {
        o1["actionType"] = "to_group";
        o1["deciId"] = r[gn1];
        o1["optionId"] = "4";
        o1["spillId"] = '7';
      } else if (r[gn_type1] == '2') {
        o1["actionType"] = "to_service";
        o1["deciId"] = r[gn1];
        o1["optionId"] = "2";
        o1["spillId"] = '3';
      }

      result.push(o1)
      console.log(JSON.stringify(result))
      return JSON.stringify(result)
    }
  }
}


function uploadImg(urlList,callback){
  var token = wx.getStorageSync('token');
  if (token != "" && token != null) {
    var header = { 'content-type': 'application/x-www-form-urlencoded', 'Authorization':"Bearer "+token }
  } else {
    var header = { 'content-type': 'application/x-www-form-urlencoded' }
  }
  
  var url = Server + "api/v1/reservation/upload-img";//api/upload-img
  var completeNum=0;
  var returnUrlList=[];
  console.log('urlList:',urlList);
  for (var i in urlList){
    wx.uploadFile({
      url: url,
      filePath: urlList[i],
      name: 'img',
      formData:{
          "key":i
      },
      header: header,
      success:function(res){
        completeNum++;
        var obj = JSON.parse(res.data);
        returnUrlList[i] = obj.url;
        if (urlList.length == completeNum) {
          callback(returnUrlList);
        }
      },
      fail: function (e) {
        fail();
      },
      complete: function () {
        //wx.hideLoading()
      }
    })
  }
}


//判断是否绑定,true为绑定，false为未绑定
function IsCertificate(success,fail){
  request.NetRequest({
    url: 'api/v1/user/service-num',//auth/check-bind
    method:'GET',
    success: function (res) {
      if (res.data.users.isBind) {
        success();
      } else {
        fail();
      }
    }
  })
}

//判断是否为工作时间,true为是工作时间，false为非工作时间
function checkWorktime(callBack, showload=true) {
  var reauestFail;
  if (!showload){ //如果为false，基于后台请求，如遇网络错误不弹框提示
    reauestFail=function(){
      console.log("request fail");
    }
  }
  console.log(showload);
  request.NetRequest({
    url: 'util/get-worktime',
    showload: showload,
    success: function (res) {
      callBack(res);
    },
    fail: reauestFail
  });
}

function checkEmpty(obj,arrInput){
  var isEmpty=false;
  for (var i in arrInput){
    if (obj[arrInput[i]].trim().length==0){
      isEmpty=true;
      return isEmpty;
    }
  }
  return isEmpty;
}

function getUserInfo(cb){
  var user=wx.getStorageSync('userInfo');
  console.log("getUserInfo:",user);
  if (user==""){//user不存在
    request.NetRequest({
      // api/get-userinfo
      url: "api/v1/user/service-num", 
      method:"GET",
      success: function (res) {
        if (res.status) {
          user = res.data.users;
          console.log("userInfo:",user);
          wx.setStorageSync('userInfo',user);
          cb(user);
        } else {
          wx.showModal({
            title: '发生错误',
            content: '加载失败',
            showCancel: false
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '发生错误',
          content: '加载失败',
          showCancel: false
        })
      }
    });
  }else{
    cb(user);
  }
}


function backHome(){
  console.log('backHome')
  wx.switchTab({
    url: '../index/index',
  })
}

//检测是否存在，如存在就调用返回，不存在就直接跳转
function chen_navigateTo(name,url){
    var pages=getCurrentPages();
    var backPageNum=0;
    for(var i in pages){
      if (pages[i].route == name){
        backPageNum=pages.length-1-i;
          break;
       }
    }

    if(backPageNum>0){
      wx.navigateBack({
        delta: backPageNum
      })
    }else{
      wx.navigateTo({
          url:url
      })
    }
}

function submitFormId(formId){
  return true;
  if (formId.length == 0 || formId =="the formId is a mock one"){
    return false;
  }
  let url=Server+"wechat-mini/save-formid";
  var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
  var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id}
  wx.request({
    url: url,
    method: "POST",
    data: { formId:formId},
    header: header
  })
}

module.exports = {
  formatTime: formatTime,
  NetRequest: request.NetRequest,
  IsCertificate: IsCertificate,
  Server: Server,
  ocrServer: request.ocrServer,
  uploadImg: uploadImg,
  checkEmpty: checkEmpty,
  getUserInfo: getUserInfo,
  getUserInfoSobot: getUserInfoSobot,
  checkWorktime: checkWorktime,
  backHome: backHome,
  chen_navigateTo: chen_navigateTo,
  submitFormId:submitFormId,
  RtransferAction: RtransferAction,
  sobotTransfer: sobotTransfer
}
