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

let Server = "https://msd.coffeelandcn.cn/agilent_web/web/";

function NetRequest({ url, data, success, fail, complete, method = "POST" }) {
  wx.showLoading({
    title: '加载中，请稍后',
    mask: true,
  })
  var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
  if (session_id != "" && session_id != null) {
    var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id }
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
        wx.setStorageSync('PHPSESSID', res.data.session_id) //如果本地没有就说明第一次请求 把返回的session id 存入本地
      }
      console.log(res);
      let data = res.data
      res['statusCode'] === 200 ? success(data) : fail(res)
    },
    fail: function(e){
      fail();
    },
    complete: function(){
      wx.hideLoading()
    }
  })

}

//判断是否绑定,true为绑定，false为未绑定
function IsCertificate(succ,fail){
  NetRequest({
    url: 'auth/check-bind',
    success: function (res) {
      if (res.success == true) {
        succ();
      } else {
        fail();
      }
    }
  })
}

//判断是否为工作时间,true为是工作时间，false为非工作时间
function checkWorktime(succ,fail) {
  NetRequest({
    url: 'util/get-worktime',
    success: function (res) {
      if (res.success == true) {
        succ();
      } else {
        fail();
      }
    }
  });
}

module.exports = {
  formatTime: formatTime,
  NetRequest: NetRequest,
  IsCertificate: IsCertificate,
  checkWorktime: checkWorktime,
  Server: Server

}
