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
    var joined_groups=app.globalData.userInfo.joined_groups
    var groups=[]
    if(pageKind==1){
      //获取我加入的队伍
      for(let i=0;i<joined_groups.length;i++){
        if(joined_groups[i].permission=='1'){
          groups.push(joined_groups[i])
        }
      }
    }else if(pageKind==2){
      //获取我管理的所有队伍
      for(let i=0;i<joined_groups.length;i++){
        if(joined_groups[i].permission=='2'){
          groups.push(joined_groups[i])
        }
        else if(joined_groups[i].permission=='3'){
          //将我创建的组织放在最前端
          groups.unshift(joined_groups[i])
        }
      }
    }else{
      console.log('【载入组织种类时失败！请检查】')
      return
    }

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
  //跳转到组织页面
  jumoToGroups(e){
    var that=this
    console.log(e)
    var index=e.currentTarget.dataset.index
    var unique_code=this.data.groups[index].unique_code
    console.log('【用户点击的组织的唯一识别码】',unique_code)
    wx.navigateTo({
      url: '/pages/single_group/single_group?unique_code='+unique_code,
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