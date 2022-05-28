//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const command = db.command
Page({
  data: {
    //清单名称
    name:'',
    //清单
    list:[],
    //用户信息
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that=this
    var id=options.id
    var name=options.list_name
    var openid
    var list=[]
    var userInfo={}
    this.setData({
      name:name
    })
    //获取清单信息
    await db.collection('list_table').where({
      id:id
    }).get().then(res=>{
      console.log('【获取到的清单信息】',res.data[0])
      list=res.data[0]
      openid=res.data[0].openid
    })
    console.log(openid)
    //获取清单所属的个人信息
    await db.collection('user').where({
      openid:openid
    }).get().then(res=>{
      console.log('【获取到的清单所属的用户信息】',res.data[0])
      userInfo=res.data[0]
      that.setData({
        list:list,
        userInfo:userInfo
      })
    })


  },

  //返回上一页面
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})