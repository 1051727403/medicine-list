//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const command=db.command
var openid
Page({
  data: {
    //用户信息
    userInfo:app.globalData.userInfo,
    //进入页面的种类，1为我加入的组织，2为我管理的组织，根据不同的从数据库中获取不同的数据
    pageKind:0,
    //将要展示的组织列表
    groups:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    console.log(options)
    //获取类型
    var pageKind=options.pageKind
    //获取所有该类型的组织
    var groups=[]

    this.setData({
      pageKind:pageKind,
      userInfo:app.globalData.userInfo,
      groups:groups,
    })
  },
  //show函数
  show:function(){
    var that=this
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  //返回上一页面
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },
  //分享按钮
  onShareAppMessage() {
    return {
      title: "药清单",
      path:"pages/index/index",
      imageUrl:"https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
    }
  }
})