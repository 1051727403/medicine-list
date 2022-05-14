
//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
Page({
  data: {
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
  //Onload函数
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //跳转到创建组织页面
  createNewGroup(){
    wx.navigateTo({
      url: '/pages/createGroups/createGroups',
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