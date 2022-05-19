//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()

Page({
  data: {
    //用户身份信息
    userInfo:app.globalData.userInfo,
    //组织信息
    group:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that=this
    var unique_code = options.unique_code
    console.log('【获取到的唯一识别码】', unique_code)
    //用唯一识别码从数据库中获取信息
    await db.collection('groups_table')
    .where({
      unique_code:unique_code
    }).get().then(res=>{
      console.log('【从服务器中获取到的组织信息】',res)
      var group=res.data[0]
      that.setData({
        userInfo:app.globalData.userInfo,
        group:group,
      })
    })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //back函数
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //分享
  onShareAppMessage() {

  }
})