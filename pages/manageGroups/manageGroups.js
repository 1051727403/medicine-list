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
    windowHeight: app.globalData.windowHeight,
    userInfo: app.globalData.userInfo,
    //搜索到的组织列表
    groups: [],
    //搜索信息
    searchInf : "",
    clicked : false
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
    console.log("hahaha")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
    //刷新页面
    change(){
      this.onLoad()
    },
  //跳转到创建组织页面
  createNewGroup() {
    if (this.islogined()) {
      wx.navigateTo({
        url: '/pages/createGroups/createGroups',
      })
    }
  },
  //跳转到加入的组织列表页面
  jumpTo_joined() {
    if (this.islogined()) {
      wx.navigateTo({
        url: '/pages/myGroups/myGroups?pageKind=1',
      })




    }
  },
  //跳转到我管理的组织列表页面
  jumpTo_manage() {
    if (this.islogined()) {
      wx.navigateTo({
        url: '/pages/myGroups/myGroups?pageKind=2',
      })
    }
  },
  //分享按钮
  onShareAppMessage() {
    return {
      title: "药清单",
      path: "pages/index/index",
      imageUrl: "https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
    }
  },
  //获取搜索框中内容
  getInput: function (e) {
    console.log(e.detail)
    var Inf = e.detail.value
    this.setData({
      searchInf : Inf
    })
  },
  //获得搜索结果
  async searchForGroup(){
    var that=this
    that.setData({
      clicked : true
    })
    await db.collection('groups_table')
    .where({
      unique_code : that.data.searchInf
    })
    .get()
    .then(res=>{
      that.setData({
        groups : res.data
      })
    })
    console.log(that.data.groups)
  },

  //跳转到详情页
  ToSingleGroup:function(event){
    var that=this
    wx.navigateTo({
      url: '../single_group/single_group?unique_code='+event.currentTarget.dataset.unique_code,
    })
  }
})