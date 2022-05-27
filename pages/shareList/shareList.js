//无图片则使用默认图片，表示无图片
var noPhoto_url = "https://img-blog.csdnimg.cn/819c03d636a84ae49e9e715d87abe95c.png#pic_center"
//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
var openid
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //屏幕宽度
    windowWidth: app.globalData.windowWidth,
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //个人信息
    userInfo: {},
    //是否点击增加药品
    clickAddMedicineButtom: false,
    //是否是由back函数退出的（节省一次查询数据库的时间）
    press_back: false,
    //是否按下自定义输入按钮
    clickAddCustom: false,
    //是否点击确认删除
    clickDel: false,
    //新增药品的名称
    add_name: '',
    //新增药品的品牌
    add_brand: '无',
    //新增药品的规格
    add_specification: '无',
    //第一次渲染页面加载动画，和index页面相似
    is_first_show: false,
    //每次新增元素后进行动画渲染
    is_add_confirm: false,
    //移动的元素下标
    moveid: -1,
    //监控x移动程度
    movex: 0,
    //该清单中所包含的所有药品
    list: {
      id: '',
      lastModifyTime: '',
      name: '',
      openid: '',
      status: '',
      medicines: [],
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //把传过来的清单的uid和id处理出来并找到该清单
  onLoad(options) {
    var that = this
    var shareid = options.fromshare
    db.collection('list_table')
      .where({
        id: shareid
      })
      .get()
      .then(res => {
        console.log('【res------------------】', res)
        if (res.data.length == 0) {
          wx.showToast({
            title: '该清单不存在！',
            icon: 'error',
            duration: 3000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 3000)
        }
        console.log(res.data)
        that.setData({
          list: res.data[0]
        })
      })
    console.log(that.data.list)
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: (res) => {
        console.log('初始信息：', res)
        openid = res.result.openid
        if (openid == undefined) {
          console.log('openid为空')
          return
        }
        console.log("openid", openid)
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
    var that = this
    //若点击分享按钮进行分享，将该页面数据封装后作为参数传递，好友点击后根据参数渲染
    if (res.from == 'button') {
      console.log('【点击按钮进行分享】')
      //封装该页面所有信息
      return {
        title: "药清单",
        //先进index以执行登录验证
        path: "pages/index/index?fromshare=" + that.data.list.id,
        imageUrl: "https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
      }
    } else {
      return {
        title: "药清单",
        path: "pages/index/index",
        imageUrl: "https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
      }
    }
  },

  async back() {
    if (this.data.press_back == true) return
    var that = this
    this.setData({
      press_back: true
    })
    wx.navigateBack({
      delta: 1,
    })
    // //为防止数据库未更新完加载不完全，延迟中
    // setTimeout(() => {
    //   console.log("【为防止数据库未更新完加载不完全，延迟中】");
    // }, 500)
  },
  //构造最新更新时间函数
  getNowTime() {
    //构造时间标准格式
    var date = new Date
    //console.log('【date】',date)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    //console.log('【month】 ',month)
    month = (month / 10 < 1) ? '0' + month : month
    var day = date.getDate()
    day = (day / 10 < 1) ? '0' + day : day
    //console.log('【day】 ',day)
    var hour = date.getHours()
    hour = (hour / 10 < 1) ? '0' + hour : hour
    var minutes = date.getMinutes()
    minutes = (minutes / 10 < 1) ? '0' + minutes : minutes
    var now_time = year + '.' + month + '.' + day + '   ' + hour + '.' + minutes
    console.log('【now_time】', now_time)
    return now_time
  },
  //创建UUID
  create_uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  },
  //新增清单上传数据库
  async uploadDatabase(new_data) {
    var that = this
    var res = {}
    //检查参数完整性
    if (new_data.openid == "") {
      console.log('【openid缺失，新增清单无法上传数据库】')
      res.errCode = 1
      res.errMsg = '【openid缺失，新增清单无法上传数据库】'
      //console.log('[res]:',res)
      return res
    }
    //上传
    await db.collection('list_table')
      .add({
        data: new_data,
        success: re => {
          console.log('【上传成功！】', re)
          res.errCode = 0
          res.errMsg = '【上传新增清单成功！】'
        },
        fail: re => {
          res.errCode = 2
          res.errMsg = '【上传清单时发生未知错误】'
        },

      })
    //console.log('[res]:',res)
    return res

  },
  //新增清单
  async add_confirm() {
    var that = this
    //提示用户是否复制清单
    wx.showModal({
      title: '提示',
      content: '确认将该清单添加到我的清单？',

      success(res) {
        if (res.confirm) {
          console.log('【用户确认将该清单添加到我的清单】')

          //获取当前时间用于更新
          var now_time = that.getNowTime()
          //利用时间戳+随机数与16进制生成uuid
          var id = that.create_uuid()
          console.log('【生成uuid】', id)
          var new_data = {
            openid: openid,
            id: id,
            name: that.data.list.name,
            lastModifyTime: now_time,
            status: 0, //0代表什么状态也没有
            medicines: that.data.list.medicines
          }
          console.log('new_data:', new_data)
          /*该处上传数据库  start*/
          that.uploadDatabase(new_data)
          var pages = getCurrentPages()
          var prePages = pages[pages.length - 2]
          prePages.setData({
            is_from_medicineList: true,
          })
          //提示用户添加成功！
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})