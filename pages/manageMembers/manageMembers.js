//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const command = db.command
Page({
  data: {
    //机型
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //组织唯一识别码
    unique_code:'',
    //成员列表
    member_list:[],
    //当前点击改变权限的下标
    index:-1,
  },
  onLoad(options) {
    console.log(options)
    var that=this
    var unique_code=options.unique_code
    const eventchannel = this.getOpenerEventChannel()
    eventchannel.on('translate', data => {
      console.log('【onload传输进该页面的数据】', data)
      var member_list=data.data
      //对成员列表进行排序,将管理员放在前面
      for(let i=0;i<member_list.length;i++){
        if(member_list[i].permission==2){
          member_list.splice(1,0,member_list.splice(i,1))
        }
      }
      that.setData({
        member_list:member_list,
        unique_code:unique_code
      })
    })




  },
  //改变用户权限
  changePermission(e){
    console.log(e)
    var index=e.currentTarget.dataset.index
    var member=that.data.member_list[index]

    if(member.permission==3){
      wx.showToast({
        title: '不能更改创建者权限！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      changePermission:true,
      index:index
    })
  },
  //取消更改
  cancel(){
    this.setData({
      changePermission:false
    })
  },
  //设为管理员
  set_administrator(){
    var that=this
    var index=that.data.index
    var member=that.data.member_list[index]
    if(member.permission==2){
      wx.showToast({
        title: '该用户已为管理员！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    //将该人设为管理员




    //渲染页面


  },
  //踢出组织
  kickOut(){

  },
  //返回上一页面
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  onShow() {

  },

  onShareAppMessage() {

  }
})