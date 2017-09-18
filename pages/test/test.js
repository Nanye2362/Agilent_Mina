// Page({
//   data: {
//     lastX: 0,  // 按下时的坐标
//     lastY: 0,
//     text: "没有滑动",
//     left:0,   // 元素定位的左边距离
//     disX: 0  //按下时距元素左边的距离
//   },
//   handletouchmove: function (event) {
//     let currentX = event.touches[0].pageX
//     var x = currentX - this.data.disX;
//       this.setData({
//         left: x +'px'
//       })
//   },
//   handletouchtart: function (event) {
//     console.log(event)
//     this.data.lastX = event.touches[0].pageX;
//     this.data.disX = event.touches[0].pageX - event.target.offsetLeft;
//     console.log(this.data.disX);
//   }
// })

Page({
  data: {
    x: 0,
    y: 0
  },
  tap: function (e) {
    this.setData({
      x: 30,
      y: 30
    });
  },
  onLoad: function(){
    var meiqia = wx.getStorageSync('meiqia')
    this.setData({
      WLA: meiqia.WLA
    })
  },
})