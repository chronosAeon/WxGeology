// components/moveImg/moveImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img_url: String,
    angle: Number,
    centerX: Number,
    centerY: Number
  },

  /**
   * 组件的初始数据
   */
  //5度为阈值
  data: {

    angle_threshold_value: 5
  },
  attached: function () {
    const ctx = wx.createCanvasContext('mycanvas', this)

    this.setData({
      ctx: ctx,
    })
    wx.downloadFile({
      url: 'https://chronos.fzerolight.cn/static/98/+N/0.jpg',
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        //每次下载一次都要有缓存机制，就不用每次微信服务器都取下载一次图片
        //最好是大图

        if (res.statusCode === 200) {
          var rr = res.tempFilePath;
          console.log(rr)
          ctx.drawImage(rr, 0, 0, 1920, 1331, 0, 0, 400, 285)
          ctx.draw()
          // wx.playVoice({

          //   filePath: res.tempFilePath
          // })
        }
      }
    })
    // wx.getImageInfo({
    //   src: 'https://chronos.fzerolight.cn/static/98/+N/0.jpg',    //请求的网络图片路径
    //   success: function (res) {
    //     console.log(res)
    //     // 请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
    //     wx.setStorage({
    //       key: storageKeyUrl,
    //       data: res.path,
    //     });'/images/total.jpg'

    //   }
    // })

    // ctx.save
  },
  moved: function () { },
  detached: function () { },
  /**
   * 组件的方法列表
   */
  methods: {
    touchstart: function (e) {
      //important：这个地方应该是有当前角度的记忆功能
      //开始的时候计算线函数
      // console.log(e.touches[0])

      if (!this.angle) {
        //如果是第一滑动就赋值为零,开始点击就开始设置初始点击位置点
        this.setData({
          angle: 0,
          startX: e.touches[0].x,
          startY: e.touches[0].y
        })
      }
      var slope = this.calculate_slope(this.data.startX, this.data.startY, this.data.centerX, this.data.centerY)
      var b = this.calculate_b(slope, this.data.centerX, this.data.centerY)
      var is_reverse = this.is_start_point_in_reverse_location(this.data.startX)
      this.setData({
        slope: slope,
        b: b,
        is_reverse: is_reverse
      })
    },
    touchmove: function (e) {
      console.log('x:' + this.data.centerX + 'y:' + this.data.centerY)
      this.setData({
        angle: this.data.angle + 1,
        currentX: e.touches[0].x,
        currentY: e.touches[0].y
      })
      var get_position = this.calculate_point_location(this.data.slope, this.data.b, this.data.currentX, this.data.currentY)
      console.log('currentX:' + this.data.currentX + 'currentY:' + this.data.currentY)
      //这里拿到弧度值
      var hd = this.calculate_Angel(this.data.startX, this.data.startY, this.data.currentX, this.data.currentY)
      var angle = Math.ceil(180 / Math.PI * hd);
      if (this.data.is_reverse) {
        angle = 360 - angle;
      }
      //获得角度
      if (get_position) {
        angle = 180 + (180 - angle)
      }
      console.log(angle)
      this.draw_long_img(angle, this.data.angle_threshold_value, 200, 100)
      //要实现360度而不是180度旋转就必须做屏幕切分，每次点击开始的时候把开始点连接中心线，然后做这条线的垂线然后判断当前触碰区域是否在第三第四象限，如果在就是角度累加180
    },

    touchend: function (e) {
    },
    draw_long_img(angle, angle_threshold_value, eachImgwidth, eachImgHeight) {
      var page = parseInt(angle / angle_threshold_value)
      var clipY = eachImgHeight * page
      var weight = eachImgwidth
      console.log(page)

      if (this.data.page != page) {
        wx.downloadFile({
          url: 'https://chronos.fzerolight.cn/static/98/+N/' + page + '.jpg',
          success: res => {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

            if (res.statusCode === 200) {
              var rr = res.tempFilePath;
              console.log(rr)
              this.data.ctx.drawImage(rr, 0, 0, 1920, 1331, 0, 0, 400, 285)
              this.data.ctx.draw()
              // wx.playVoice({

              //   filePath: res.tempFilePath
              // })
            }
          }
        })
      }
      this.setData({
        page: page
      })
      // this.data.ctx.drawImage('https://chronos.fzerolight.cn/static/98/+N/'+page+'.jpg', 0, 0, 1920, 1331, 0, 0, 400, 285)
      // this.data.ctx.draw()
    },
    is_start_point_in_reverse_location: function (startX) {
      if (startX <= this.data.centerX) {
        console.log('true')
        return true
      }
      else {
        console.log('false')
        return false
      }
    },
    calculate_point_location: function (slope, b, CurrentX, CurrentY) {
      // 返回false表示点在线段的左边或下边,如果true表示点在线段右边或者上边
      console.log('lineY:' + (CurrentX * slope + b))
      if ((CurrentX * slope + b) <= CurrentY) {

        console.log('false')
        return false
      }
      else {
        console.log('true')
        return true
      }
    },
    calculate_slope: function (first_pointX, first_pointY, second_pointX, second_pointY) {
      // 斜率计算是有问题的
      var slope = (first_pointY - second_pointY) / (first_pointX - second_pointX)
      return slope
    },
    calculate_b: function (slope, pointX, pointY) {
      var b = pointY - (slope * pointX)
      return b
    },
    calculate_y: function (pointX, slope, b) {
      return slope * pointX + b
    },
    calculate_Angel: function (startX, startY, currentX, currntY) {
      // console.log(this.data.centerY)
      var c = this.calculate_Distance(this.data.startX, this.data.startY, this.data.currentX, this.data.currentY)

      var a = this.calculate_Distance(this.data.startX, this.data.startY, this.data.centerX, this.data.centerY)
      var b = this.calculate_Distance(this.data.currentX, this.data.currentY, this.data.centerX, this.data.centerY)
      var cosc = (a * a + b * b - c * c) / (2 * a * b)
      // console.log(cosc)
      var angle = Math.acos(cosc)
      // console.log(angle)
      // 返回角度
      return angle
    },
    //计算两点之间的距离
    calculate_Distance: function (startX, startY, endX, endY) {
      var x_abs = Math.abs(startX - endX)
      var y_abs = Math.abs(startY - endY)
      var distance = Math.sqrt(x_abs * x_abs + y_abs * y_abs)
      return distance
    }
  }
})
