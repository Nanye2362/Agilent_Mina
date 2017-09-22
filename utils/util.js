function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//let Server = "https://devopsx.coffeelandcn.cn/"; //DEV
let Server = "https://devops.coffeelandcn.cn/"; //UAT

function NetRequest({ url, data, success, fail, complete, method = "POST" ,showload=true}) {
  var app=getApp();
  if (showload){
    wx.showLoading({
      title: '加载中，请稍后',
      mask: true
    })
  }
  var _csrf = wx.getStorageSync('csrf');
  var csrfToken = wx.getStorageSync('csrfCookie')
  if (typeof (data) !='undefined'){
    data._csrf = _csrf;
  }
  var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
  if (session_id != "" && session_id != null) {
    var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id + ";" + csrfToken}
  } else {
    var header = { 'content-type': 'application/x-www-form-urlencoded' }
  }

  console.log(session_id);
  url = Server + url;
  wx.request({
    url: url,
    method: method,
    data: data,
    header: header,
    success: res => {
      if (session_id == "" || session_id == null) {
        wx.setStorageSync('PHPSESSID', res.data.session_id); //如果本地没有就说明第一次请求 把返回的session id 存入本地
        var str =res.header['Set-Cookie'];
        var m=str.match(/_csrf=(.)*?;/);
        if(m!=null){
          wx.setStorageSync('csrfCookie', m[0]);
        }  
        wx.setStorageSync('csrf', res.data.csrfToken)
      }
  
      let data = res.data
      res['statusCode'] === 200 ? success(data) : fail(res)
    },
    fail: function(e){
      fail();
    },
    complete: function(){
      if(typeof(complete)=='function'){
        complete();
      }
      if (!app.globalData.isLoading){
        wx.hideLoading()
      }  
    }
  })

}

function uploadImg(urlList,callback){
  var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
  if (session_id != "" && session_id != null) {
    var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id }
  } else {
    var header = { 'content-type': 'application/x-www-form-urlencoded' }
  }

  //console.log(session_id);
  var url = Server + "api/upload-img";
  var completeNum=0;
  var returnUrlList=[];
  for (var i in urlList){
    wx.uploadFile({
      url: url,
      filePath: urlList[i],
      name: 'img',
      formData:{
          key:i
      },
      header: header,
      success:function(res){
        completeNum++;
        var obj = JSON.parse(res.data);
        returnUrlList[obj.key] = obj.url;
        if (urlList.length == completeNum) {
          callback(returnUrlList);
        }
      },
      fail: function (e) {
        fail();
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  }
}


//判断是否绑定,true为绑定，false为未绑定
function IsCertificate(success,fail){
  NetRequest({
    url: 'auth/check-bind',
    success: function (res) {
      if (res.success == true) {
        success();
      } else {
        fail();
      }
    }
  })
}

//判断是否为工作时间,true为是工作时间，false为非工作时间
function checkWorktime(success,fail) {
  NetRequest({
    url: 'util/get-worktime',
    success: function (res) {
      if (res == 1) {
        success();
      } else {
        fail();
      }
    }
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
  if (user==""){//user不存在
    NetRequest({
      url: "api/get-userinfo", success: function (res) {
        if (res.success) {
          user = res.info;
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

module.exports = {
  formatTime: formatTime,
  NetRequest: NetRequest,
  IsCertificate: IsCertificate,
  Server: Server,
  uploadImg: uploadImg,
  checkEmpty: checkEmpty,
  getUserInfo: getUserInfo,
  checkWorktime: checkWorktime
}
