// pages/myGroups/myGroups.js
Page({
  data: {
    //进入页面的种类，1为我加入的组织，2为我管理的组织，根据不同的从数据库中获取不同的数据
    pageKind:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    console.log(options)
    var pageKind=options.pageKind
    this.setData({
      pageKind:pageKind
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