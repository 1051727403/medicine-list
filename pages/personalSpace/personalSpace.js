const app = getApp()

wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})

const db = wx.cloud.database()
const _ = db.command
var openid
Page({
  data: {
    //顶部自定义导航栏适配各种机型
    statusBarHeight: app.globalData.statusBarHeight,
    userInfo: app.globalData.userInfo,
    logged: app.globalData.logged,
  },

  //复用型函数
  //检测是否登录
  islogined() {
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
      })
      return false
    }
    return true
  },
  //创建UUID
  create_uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
},
  //新增清单上传数据库
  async uploadDatabase(new_data){
    var that=this
    var res={}
    //检查参数完整性
    if(new_data.openid==""){
      console.log('【openid缺失，新增清单无法上传数据库】')
      res.errCode=1
      res.errMsg='【openid缺失，新增清单无法上传数据库】'
      //console.log('[res]:',res)
      return res 
    }
    //上传
    await db.collection('list_table')
    .add({
      data:new_data,
      success:re=>{
        console.log('【上传成功！】',re)
         res.errCode=0
         res.errMsg='【上传新增清单成功！】'
      },
      fail:re=>{
        res.errCode=2
        res.errMsg='【上传清单时发生未知错误】'
      },
      
    })
    //console.log('[res]:',res)
    return res

  },
  //新增一个初始清单
  async add_comfirm() {
    var that=this

    var date = new Date
    var year = date.getFullYear()
    var month = date.getMonth()
    month = (month / 10 < 1) ? '0' + month : month
    var day = date.getDay()
    day = (day / 10 < 1) ? '0' + day : day
    var hour = date.getHours()
    hour = (hour / 10 < 1) ? '0' + hour : hour
    var minutes = date.getMinutes()
    minutes = (minutes / 10 < 1) ? '0' + minutes : minutes

    var now_time = year + '.' + month + '.' + day + '   ' + hour + '.' + minutes
    console.log(now_time)
    //利用时间戳+随机数与16进制生成uuid
    var id=that.create_uuid()
    console.log('【生成uuid】',id)
    var new_data = {
      openid:openid,
      id:id,
      name:"药品清单",
      lastModifyTime: now_time,
      status: 0,  //0代表什么状态也没有
      medicines:[]
    }
    console.log('new_data:', new_data)
    /*该处上传数据库  start*/
    await this.uploadDatabase(new_data)
    /*该处上传数据库  end*/
    
  },
    //原本云函数中的注册
    async wechat_sign(event) {
      ////1、检测openid是否正确获取
      // const wxContext = cloud.getWXContext()
      // console.log('成功获取用户信息')
      // console.log(wxContext)
      // if (wxContext == undefined) {
      //   var result = {}
      //   result.errCode = 1
      //   result.errMsg = '未能正确获取用户ID，请重试'
      //   var data = {}
      //   result.data = data
      //   return result
      // }
      //2、校验参数是否完整
      if (event.avatarUrl == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = '未传必要参数，请重试'
        var data = {}
        result.data = data
        return result
      }
      //3、根据openid获取用户信息  若获取到则更新，若没获取到，则添加
      //实例化数据库
      var user
      await db.collection('user')
        .where({
          openid: event.openid
        })
        .get().then(res => {
          console.log('获取用户信息成功!', res.data)
          user = res.data[0]
        })
      var add_result
      //若不存在该用户信息
      if (user == undefined) {
        //构造要添加的数据
        var to_add_data = {
          nickname: event.nickname,
          avatarUrl: event.avatarUrl,
          openid: event.openid,
          is_admin: 0, //1为管理员，0为普通用户
          signTime: new Date(),
          real_name:'',
          id_number:'',
          phone_number:'',
          health_number:'',
          address:{
            area:'',
            building:'',
            no:'',
            room:''
          },
          joined_groups:[],
        }
        console.log('新增的用户数据：', to_add_data)
        await db.collection('user')
          .add({
            data: to_add_data
          }).then(res => {
            console.log('新增用户成功！:', res)
            add_result = res._id
          })
      } //若已存在，则更新头像和nickname
      else {
        await db.collection('user')
          .where({
            openid: event.openid
          })
          .update({
            data: {
              //更新头像
              nickname: event.nickname,
              avatarUrl: event.avatarUrl,
            }
          }).then(res => {
            console.log('更新成功！', res)
          })
      }
  
      //4、查询最新信息，返回前端
      await db.collection('user')
        .where({
          openid: event.openid
        })
        .get().then(res => {
          console.log('获取用户最新信息成功！', res.data)
          user = res.data[0]
          delete user._openid
          delete user._id
        })
      var result = {}
      console.log('add_result:', add_result)
      if (add_result == null) {
        result.errCode = 0
        result.errMsg = '更新用户信息成功！'
      } else {
        result.errCode = 0
        result.errMsg = '新增用户成功！'
      }
      //为每个用户创建一个初始药品清单 start
      this.setData({
        medicineList:[]
      })
      this.add_comfirm()
      this.setData({
        ListName:""
      })
      //为每个用户创建一个初始药品清单 end
      var data = {}
      data.user = user
      result.data = data
      return result
    },
  
    //注册与同步
    async sign(res) {
     // console.log(res)
      if (openid == null) {
        console.log('openid获取失败，注册失败')
        return;
      }
      console.log('授权个人信息：', res.userInfo)
      var that = this
      //封装
      var event = {}
      event.openid = openid
      event.avatarUrl = res.userInfo.avatarUrl
      event.nickname = res.userInfo.nickName
      var info = await this.wechat_sign(event)
      console.log('调用[wechat_sign]云函数成功！', info)
      var user = info.data.user
      this.setData({
        userInfo: user,
        logged: true,
        new_user: false,
      })
      //放到全局
      app.globalData.userInfo = user
      app.globalData.logged = that.data.logged
      console.log('全局变量userInfo：', app.globalData.userInfo)
    },
    //判断是否曾经登陆过,若登陆过则返回该人信息，若无则返回错误代码
    async is_logged_before(event) {
      /**监测参数是否完整 */
      if (event.openid == undefined) {
        var result = {}
        result.errcode = 1;
        result.errMsg = '传入参数不全'
        var data = {}
        result.data = data
        return result
      }
      //查看数据库中是否有该用户之前的注册记录
      var result = {}
      var data = {}
      var logged = false
      var avatarUrl = ''
      var is_admin = ''
      var nickname = ''
      var signTime = ''
      var real_name=''
      var id_number=''
      var phone_number=''
      var health_number=''
      var address={}
      var joined_groups=[]
      await db.collection('user')
        .where({
          _openid: event.openid
        }).get().then(res => {
          console.log('检测:', res)
          if (res.data.length == 0) {
            console.log('不存在该用户的登录信息')
          } else {
            console.log('存在该用户', res)
            //将用户信息封装
            logged = true
            avatarUrl = res.data[0].avatarUrl
            is_admin = res.data[0].is_admin
            nickname = res.data[0].nickname
            signTime = res.data[0].signTime
            real_name = res.data[0].real_name
            id_number = res.data[0].id_number
            phone_number = res.data[0].phone_number
            health_number = res.data[0].health_number
            address = res.data[0].address
            joined_groups=res.data[0].joined_groups
          }
        })
        //封装
        data.logged=logged
        data.avatarUrl=avatarUrl
        data.is_admin=is_admin
        data.nickname=nickname
        data.signTime=signTime
        data.real_name=real_name
        data.id_number=id_number
        data.phone_number=phone_number
        data.address=address
        data.joined_groups=joined_groups
        //console.log('【data】',data)
      //检测是否登陆过
      if (data.logged == 0) {
        console.log('该用户未曾登陆过')
        result.errcode = 2
        result.errMsg = '该用户未曾注册过'
      } else {
        console.log('获取用户之前注册信息成功！')
        //console.log('【data】',data)
        result.errcode = 0
        result.errMsg = '获取用户之前登录信息成功！'
      }
      result.data = data
      return result
    },
    //其余函数
    async judge_logged() {
      var that = this
      var event = {}
      event.openid = openid
      //检测曾经是否授权登陆过
      var res = await this.is_logged_before(event)
      console.log(res)
      if (res.errcode == 2) {
        //若不能自动登录则出现弹窗提示用户进行登录
        this.setData({
          new_user: true,
        })
        return
      }
      console.log('获取该用户过去登录信息成功！', res)
      var data = res.data
      data.openid = openid
      that.setData({
        logged: data.logged,
        userInfo: data,
        new_user:false,
      })
      app.globalData.userInfo = data
      app.globalData.logged = that.data.logged
      console.log('全局变量userInfo：', app.globalData.userInfo)
    },
  //用户静默登录
  onLoad() {
    //不调用云函数的方法
    const that = this
    if (app.globalData.logged == false) {
      //，根据openid判断是否曾经注册过，实现微信用户静默登录，
      //云函数获取openid
      wx.cloud.callFunction({
        name: 'getOpenid',
        success: (res) => {
          console.log('初始信息：', res)
          openid = res.result.openid
          if (openid == undefined) {
            console.log('openid为空')
            return
          }
          console.log("openid", openid)
          //判断曾经是否登陆过
          that.judge_logged()
        }
      })
    }
  },
  //每次展示刷新，防止出现在index页面登陆后personalSpace页面没有登录的情况
  onShow(){
    var that=this
    this.setData({
      userInfo: app.globalData.userInfo,
      logged: app.globalData.logged,
    })
  },

  //用户第一次登录/重复登录函数
  getuserinfo(e) {
    var that = this
    if (this.data.logged) {
      wx.showModal({
        title: '重复登录',
        content: '再次登录可同步您当前微信个人信息',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定,重复登录，同步微信信息')
            wx.getUserProfile({
              desc: '同步微信个人信息',
              success: (res) => {
                console.log('重复登录的res', res)
                //云函数获取openid
                wx.cloud.callFunction({
                  name: 'getOpenid',
                  success: (r) => {
                    console.log('初始信息：', r)
                    openid = r.result.openid
                    if (openid == undefined) {
                      console.log('openid为空')
                      return
                    }
                    console.log("重复登录获取openid", openid)
                    that.sign(res)
                  }
                })

              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消,取消同步微信个人信息')
            return
          }
        }
      })
    } else {
      wx.getUserProfile({
        desc: '登录后可查看收藏与历史记录',
        success: (res) => {
          //console.log('getUserProfile函数中的res',res)
          that.sign(res)
          //引导用户完善个人信息
          wx.showModal({
            title: '提示',
            content: '为了获取更完善的功能，请填写相关信息',
            showCancel:true,
            confirmColor:"#07c160",
            success:res=>{
              if(res.confirm){
                console.log('【引导用户完善个人信息，用户点击确定】')
                setTimeout(() => {
                  console.log("【引导用户完善个人信息，为防止过快点击加载不完全，延迟中】");
                  wx.navigateTo({
                    url: '../personnalInfo/personalInfo',
                  })
                }, 500)
                
              }else{
                console.log('【引导用户完善个人信息，用户点击取消】')
              }
            }
          })    
        },
        fail: (res) => {
          console.log('用户取消授权登录')
        }
      })

    }
  },
  //跳转到个人信息页面
  jumpToPersonalInfo(){
    if (!this.islogined()) return
    else {
      wx.navigateTo({
        url: '../personnalInfo/personalInfo',
      })
    }
  },

  //跳转到我的清单页面
  jumpToIndex() {
    if (!this.islogined()) return
    else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },

  //跳转到加入的组织
  jumpToMyGroup() {
    if (!this.islogined()) return
    else {
      wx.navigateTo({
        url: '/pages/myGroups/myGroups?pageKind=1',
      })
    }
  },
  //跳转到我管理的组织页面
  jumpToJoinedGroup() {
    if (!this.islogined()) return
    else {
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