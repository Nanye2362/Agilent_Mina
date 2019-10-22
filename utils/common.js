function myfunc() {
  console.log("myfunc....");
} 
module.exports.myfunc = myfunc;
module.exports.uploadimg = uploadimg;
module.exports.clickToNext = clickToNext;

//图片上传
function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;
  wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    name: 'fileData',
    formData: null,
    success: (resp) => {
      success++;
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里
    },
    fail: (res) => {
      fail++;
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;
      if (i == data.path.length) {  //当图片传完时，停止调用     
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }

    }
  });
}

function clickToNext(event) {
  var url = event.currentTarget.dataset.url;
  wx.navigateTo({
    url: url,
  })
}