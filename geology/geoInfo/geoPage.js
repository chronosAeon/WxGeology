// geoInfo/geoPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   centerX: 120,
    //   centerY: 510
    // })
    // var _this = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#kz').boundingClientRect()
    query.exec(res=> {
      //res就是 该元素的信息 数组
      console.log(res);
      var centerX = res[0].width / 2;
      var centerY = res[0].height / 2;
      this.setData({
        centerX: centerX,
        centerY: centerY
      })
      // this.a()
      //取高度
      // _this.setData({
      //   realWidth: res[0].width,
      //   realHeight: res[0].height
      // })
      // console.log('取高度', _this.data.realHeight);
    })
  },
  a: function () {
    wx.request({
      url: 'http://140.143.91.27:8080/UserLogin',
      data: {
        'code': '033mByYq1dfifo05dkVq1kyDYq1mByYK'
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      // dataType: 'json',
      // responseType: 'text',
      success(res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
    })
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

  }
})