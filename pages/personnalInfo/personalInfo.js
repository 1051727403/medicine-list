const app = getApp()

wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})

const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    //顶部自定义导航栏适配各种机型
    statusBarHeight: app.globalData.statusBarHeight,
    userInfo: app.globalData.userInfo,
    logged: app.globalData.logged,
    real_name:'',
    gender:'0',
    id_number:'',
    phone_number:'',
    health_number:'',
    area:'',
    building:'',
    no:'',
    room:'',
  },
  //onload函数
  onLoad() {
    var that=this
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      userInfo: app.globalData.userInfo,
      logged: app.globalData.logged,
      real_name:app.globalData.userInfo.real_name,
      gender:app.globalData.userInfo.gender,
      id_number:app.globalData.userInfo.id_number,
      phone_number:app.globalData.userInfo.phone_number,
      health_number:app.globalData.userInfo.health_number,
      area:app.globalData.userInfo.address.area,
      building:app.globalData.userInfo.address.building,
      no:app.globalData.userInfo.address.no,
      room:app.globalData.userInfo.address.room,
    })
  },
  //OnShow函数
  onShow(){
    var that=this
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      userInfo: app.globalData.userInfo,
      logged: app.globalData.logged,
      real_name:app.globalData.userInfo.real_name,
      gender:app.globalData.userInfo.gender,
      id_number:app.globalData.userInfo.id_number,
      phone_number:app.globalData.userInfo.phone_number,
      health_number:app.globalData.userInfo.health_number,
      area:app.globalData.userInfo.address.area,
      building:app.globalData.userInfo.address.building,
      no:app.globalData.userInfo.address.no,
      room:app.globalData.userInfo.address.room,
    })
  },
  //获取姓名
  getRealName(e){
    //console.log('【输入姓名】',e)
    var real_name=e.detail.value
    this.setData({
      real_name:real_name
    })
  },
  //获取身份证号
  getIdNumber(e){
    //console.log('【输入身份证号】',e)
    var id_number=e.detail.value
    this.setData({
      id_number:id_number
    })
  },
  //获取联系电话
  getPhoneNumber(e){
    //console.log('【输入联系电话】',e)
    var phone_number=e.detail.value
    this.setData({
      phone_number:phone_number
    })
  },
    //获取联系电话
    getHealthNumber(e){
      //console.log('【输入联系电话】',e)
      var health_number=e.detail.value
      this.setData({
        health_number:health_number
      })
    },
  //获取居住地址
  getArea(e){
    //console.log('【输入居住地址】',e)
    var area=e.detail.value
    this.setData({
      area:area
    })
  },
  //获取详细地址中的幢/栋号
  getBuilding(e){
    //console.log('【输入幢/栋】',e)
    var building=e.detail.value
    this.setData({
      building:building
    })
  },
  //获取楼号
  getNo(e){
    //console.log('【输入楼号】',e)
    var no=e.detail.value
    this.setData({
      no:no
    })
  },
  //获取室号
  getRoom(e){
    //console.log('【输入姓名】',e)
    var room=e.detail.value
    this.setData({
      room:room
    })
  },
  //退出时不进行保存
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },
  //提交表单，手动保存个人信息
  async formSubmit(e){
    var that=this
    //console.log(e)
    var gender=e.detail.value.gender
    //console.log(gender)

    /*判断个人信息是否填写完整&规范  start*/
    //检查每个信息是否完整,除了医保卡号和居住地址area不为必填外其余均需填写
    if(that.data.real_name==''||gender==""||that.data.id_number==""||that.data.phone_number==""||that.data.building==""||that.data.no==""||that.data.room==""){
      wx.showModal({
        title: '提示',
        content: '请完善所有信息后再保存!',
        showCancel:false,
        confirmColor:"#07c160",
      })    
      return
    }
    //检查身份证号长度是否符合规范
    if(that.data.id_number.length!=18){
      wx.showModal({
        title: '提示',
        content: '身份证号长度不符合规范！',
        showCancel:false,
        confirmColor:"#07c160",
      })    
      return
    }
    //检查联系电话长度是否满足规范11位。
    if(that.data.phone_number.length!=11){
      wx.showModal({
        title: '提示',
        content: '手机号码不符合规范!(需11位)', 
        showCancel:false,
        confirmColor:"#07c160",
      })    
      return
    }
    /*判断个人信息是否填写完整&规范  end*/

    //console.log('【居住地址】',address)
    /*提示用户保存成功并将个人信息上传数据库 start*/
    var userInfo=that.data.userInfo
    userInfo.real_name=that.data.real_name
    userInfo.gender=gender
    userInfo.id_number=that.data.id_number
    userInfo.phone_number=that.data.phone_number
    userInfo.health_number=that.data.health_number
    userInfo.address.area=that.data.area
    userInfo.address.building=that.data.building
    userInfo.address.no=that.data.no
    userInfo.address.room=that.data.room
    console.log('【完善个人信息后的userInfo】',userInfo)
    //将个人信息保存到全局
    app.globalData.userInfo=userInfo
    //更新数据库中的个人信息
    await db.collection('user')
    .where({
      openid:userInfo.openid
    })
    .update({
      data:userInfo
    })
    .then(res=>{
      console.log('【更新数据库中的个人信息成功！】',res)
    })
    wx.showModal({
      title: '提示',
      content: '保存成功！', 
      showCancel:false,
      confirmColor:"#07c160",
    })    
    /*提示用户保存成功并将个人信息上传数据库 start*/
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