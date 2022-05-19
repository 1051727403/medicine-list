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
    //用户身份和权限
    permission:'0',
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
      //获取用户身份和权限
      var permission='0'
      var joined_groups=app.globalData.userInfo.joined_groups
      //遍历用户加入的组织
      for(let i=0;i<joined_groups.length;i++){
        if(joined_groups[i].unique_code==unique_code){
          permission=joined_groups[i].permission
        }
      }
      that.setData({
        userInfo:app.globalData.userInfo,
        group:group,
        permission:permission
      })
    })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //退出或加入组织
  async changeJoinState(){
    var that=this
    //保存原有权限
    var permission=that.data.permission
    this.setData({
      permission:permission=='0'?'1':'0',
    })
    /*
      后端实现加入、退出、解散

    
    */
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