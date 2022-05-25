//无图片则使用默认图片，表示无图片
var noPhoto_url = "https://img-blog.csdnimg.cn/819c03d636a84ae49e9e715d87abe95c.png#pic_center"
//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
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
      medicines: [{
          name: "头孢克圬分散片321654165465441546541",
          url: noPhoto_url,
          specification: "无",
          brand: "无",
          number: 0,
        },
        {
          name: "头孢克圬分散片",
          url: noPhoto_url,
          specification: "无",
          brand: "无",
          number: 0,
        }
      ],
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
//把传过来的清单的uid和id处理出来并找到该清单
  onLoad(options) {
    var that=this
    var shareid=options.fromshare
    db.collection('list_table')
    .where({
      id : shareid
    })
    .get()
    .then(res=>{
      console.log(res.data)
      that.setData({
        list : res.data
      })
    })
    console.log(that.data.list)
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
    var that=this
    //若点击分享按钮进行分享，将该页面数据封装后作为参数传递，好友点击后根据参数渲染
    if (res.from == 'button') {
      console.log('【点击按钮进行分享】')
      //封装该页面所有信息
      return {
        title: "药清单",
        //先进index以执行登录验证
        path: "pages/index/index?fromshare="+that.data.list.id,
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
  async uploadDatabase() {
    var that = this
    //给清单列表页面传值，表示从药品列表页面返回，需要重新加载清单
    var pages = getCurrentPages()
    var prePages = pages[pages.length - 2]
    prePages.setData({
      is_from_medicineList: true,
    })
    //添加新的清单（视为更新）
    var lastModifyTime = that.getNowTime()
    var new_data = that.data.list
    new_data.lastModifyTime = lastModifyTime
    db.collection('list_table')
      .add({
        data: new_data
      }).then(res => {
        console.log('【更新清单成功！】', res)
      })
  },

  submit() {
    console.log(this.data.list)
    this.uploadDatabase()
  }
})