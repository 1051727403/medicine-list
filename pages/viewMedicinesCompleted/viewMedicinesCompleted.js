//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    //屏幕宽度
    windowWidth: app.globalData.windowWidth,
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //清单名称
    name: '',
    //清单
    list: [],
    //用户信息
    userInfo: {},
    //在上一页面中所属的下标
    index: '',
  },
  //删除上一页面的对应index的清单
  del_prePage() {
    var that = this
    var index = this.data.index
    var pages = getCurrentPages()
    var prePage = pages[pages.length - 2]
    var completed_medicine_list = prePage.data.completed_medicine_list
    completed_medicine_list.splice(index, 1)
    prePage.setData({
      completed_medicine_list: completed_medicine_list
    })
  },
  //获取时间，返回格式化的时间
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
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this
    var list = []
    var userInfo={}
    //获取信息
    const eventChannel=this.getOpenerEventChannel()
    eventChannel.on('transform',data=>{
      console.log('【上个页面获取的完成清单信息】',data)
      list=data.data.list.list
      userInfo=data.data.list.submit_userInfo
    })
    that.setData({
      list:list,
      userInfo:userInfo,
    })
  },

  //返回上一页面
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})