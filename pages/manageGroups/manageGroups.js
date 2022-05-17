
//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
Page({
  data: {
    //机型参数
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight:app.globalData.windowHeight,
    userInfo:app.globalData.userInfo,
    //搜索到的组织列表
    groups:[
      {
        unique_code:'',
        name:'',
        introduction:'',
        create_time:'',
        members_number:'',
        address:'',
      },
      {
        unique_code:'',
        name:'',
        introduction:'',
        create_time:'',
        members_number:'',
        address:'',
      }
    ]
  },
    //复用型函数
  //检测是否登录
  islogined() {
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        confirmColor: "#0ed81b"
      })
      return false
    }
    return true
  },
  //Onload函数
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that=this
    this.setData({
      userInfo:app.globalData.userInfo,
    })
  },
  //跳转到创建组织页面
  createNewGroup(){
    if(this.islogined()){
    wx.navigateTo({
      url: '/pages/createGroups/createGroups',
    })
  }
  },
  //跳转到加入的组织列表页面
  jumpTo_joined(){
    if(this.islogined()){
      wx.navigateTo({
        url: '/pages/myGroups/myGroups?pageKind=1',
      })




    }
  },
    //跳转到我管理的组织列表页面
    jumpTo_manage(){
      if(this.islogined()){
        wx.navigateTo({
          url: '/pages/myGroups/myGroups?pageKind=2',
        })
      }
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