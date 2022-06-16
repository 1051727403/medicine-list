//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const command = db.command
var openid
Page({
  data: {
    //屏幕宽度
    windowWidth: app.globalData.windowWidth,
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //用户信息
    userInfo: app.globalData.userInfo,
    //进入页面的种类，1为我加入的组织，2为我管理的组织，根据不同的从数据库中获取不同的数据
    pageKind: 0,
    id: '',
    list_name: '',
    //将要展示的组织列表
    groups: [],
    //选择提交时代他人配药的个人信息或是自己的个人信息
    chooseInfo: false,
    //配药模式：代他人配药
    for_other: false,
    //配药模式：为自己配药,默认为该模式
    for_myself: true,
    //选中的组织
    unique_code: '',
    //提交的用户信息
    submit_userInfo:{
      real_name:'',
      id_number:'',
      phone_number:'',
      address:{
        area:'',
        building:'',
        no:'',
        room:'',
      },
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    console.log(options)
    //获取类型
    var pageKind = options.pageKind
    //获取所有该类型的组织
    var joined_groups = app.globalData.userInfo.joined_groups
    var groups = []
    //pageKind=1位我加入的队伍，pageKind=2位我管理的队伍，pageKind=3为提交清单时的选择页面，同样展示我加入的所有队伍
    if (pageKind == 1 || pageKind == 3) {
      //获取我加入的队伍，包括我是管理员的队伍
      for (let i = 0; i < joined_groups.length; i++) {
        //if(joined_groups[i].permission=='1'){
        groups.push(joined_groups[i])
        //}
      }
    } else if (pageKind == 2) {
      //获取我管理的所有队伍
      for (let i = 0; i < joined_groups.length; i++) {
        if (joined_groups[i].permission == '2') {
          groups.push(joined_groups[i])
        } else if (joined_groups[i].permission == '3') {
          //将我创建的组织放在最前端
          groups.unshift(joined_groups[i])
        }
      }
    } else {
      console.log('【载入组织种类时失败！请检查】')
      return
    }

    this.setData({
      pageKind: pageKind,
      userInfo: app.globalData.userInfo,
      groups: groups,
      id: pageKind == 3 ? options.id : '', //若为选择界面，则将清单id传入
      list_name: pageKind == 3 ? options.list_name : '',
    })
  },
  //show函数
  show: function () {
    var that = this
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  //刷新页面
  change() {
    var that = this
    var pageKind = that.data.pageKind
    var joined_groups = app.globalData.userInfo.joined_groups
    var groups = []
    //pageKind=1位我加入的队伍，pageKind=2位我管理的队伍，pageKind=3为提交清单时的选择页面，同样展示我加入的所有队伍
    if (pageKind == 1 || pageKind == 3) {
      //获取我加入的队伍，包括我是管理员的队伍
      for (let i = 0; i < joined_groups.length; i++) {
        //if(joined_groups[i].permission=='1'){
        groups.push(joined_groups[i])
        //}
      }
    } else if (pageKind == 2) {
      //获取我管理的所有队伍
      for (let i = 0; i < joined_groups.length; i++) {
        if (joined_groups[i].permission == '2') {
          groups.push(joined_groups[i])
        } else if (joined_groups[i].permission == '3') {
          //将我创建的组织放在最前端
          groups.unshift(joined_groups[i])
        }
      }
    } else {
      console.log('【载入组织种类时失败！请检查】')
      return
    }

    this.setData({
      pageKind: pageKind,
      userInfo: app.globalData.userInfo,
      groups: groups,
    })
  },
  //构造最新更新时间函数
  getNowTime() {
    //构造时间标准格式
    var date = new Date
    //console.log('【date】',date)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    //console.log('【month】 ',month)
    month = (month / 10 < 1) ? '0' + month : month
    var day = date.getDate()
    day = (day / 10 < 1) ? '0' + day : day
    //console.log('【day】 ',day)
    var hour = date.getHours()
    hour = (hour / 10 < 1) ? '0' + hour : hour
    var minutes = date.getMinutes()
    minutes = (minutes / 10 < 1) ? '0' + minutes : minutes
    var now_time = year + '.' + month + '.' + day + '   ' + hour + '.' + minutes
    console.log('【now_time】', now_time)
    return now_time
  },
  //上传组织以及list数据库后返回清单页面
  async submitUpload(unique_code, id) {
    var that = this
    //改变list表中对应的清单的状态
    await db.collection('list_table').where({
      id: id
    }).update({
      data: {
        status: '1'
      }
    }).then(res => {
      console.log('【list清单中清单状态改变】', res)
    })
    //将该清单加入到待审核表中
    //构造要加入组织的信息
    //若代配药，则为他人的信息
    var userInfo=that.data.submit_userInfo
    //若为为自己配药，则为自己的个人信息
    if(that.data.for_myself==true){
      userInfo.real_name=that.data.userInfo.real_name
      userInfo.id_number=that.data.userInfo.id_number
      userInfo.phone_number=that.data.userInfo.phone_number
      userInfo.address=that.data.userInfo.address
    }
    console.log('【提交清单时附带的清单所属的个人信息】',userInfo)
    
    var submitted_medicine_list = {
      //获取用户提交时间信息
      submit_time: that.getNowTime(),
      //提交的清单的用户信息
      submit_userInfo:userInfo,
      //清单名称
      list_name: that.data.list_name,
      //组织唯一识别码
      unique_code: unique_code,
      //清单id
      id: id,
    }
    await db.collection('submitted_medicine_list_table').add({
      data: submitted_medicine_list
    }).then(res => {
      console.log('【成功加入待审核表中!】', res)
    })

    //提示提交成功并返回
    wx.showModal({
      title: '提示',
      content: '提交成功！',
      showCancel: 'false',
      success(res) {
        if (res.confirm) {
          console.log('提交成功！用户点击确定')
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })

  },
  //跳转到组织页面，当pageKind=3时返回清单列表页
  jumoToGroups(e) {
    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index
    var unique_code = this.data.groups[index].unique_code
    console.log('【用户点击的组织的唯一识别码】', unique_code)
    //如果该页面为提交清单时的选择页面，pageKind=3，则将该清单的状态改变，提示用户是否确认，同时上传数据库，渲染上个页面后自动返回
    if (that.data.pageKind == 3) {
      wx.showModal({
        title: '提示',
        content: '您确定要将清单提交到该组织吗？',
        confirmColor: '#0ed81b',
        cancelText: '我再想想',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              chooseInfo: true,
              unique_code: unique_code,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            return
          }
        }
      })
    } else {
      //如果不是则跳转到对应的组织页面
      wx.navigateTo({
        url: '/pages/single_group/single_group?unique_code=' + unique_code + '&index=' + index,
      })
    }

  },
  //选择代替他人配药
  for_other() {
    var that = this
    that.setData({
      for_other: true,
      for_myself: false,
    })
    //跳转到填写个人信息页面
    wx.navigateTo({
      url: '/pages/personnalInfo/personalInfo?pageKind=1',
      success(res) {
        res.eventChannel.emit('translate', {
          data: that.data.submit_userInfo
        })
      }
    })
  },
  //选择为自己配药
  for_myself() {
    var that = this
    that.setData({
      for_other: false,
      for_myself: true,
    })
  },
  //点击确定选择模式
  comfirm() {
    var that = this
    var unique_code=that.data.unique_code
    var id=that.data.id
    //改变上一页的清单状态
    var pages = getCurrentPages()
    var prePage = pages[pages.length - 2]
    prePage.setData({
      ['list.status']: 1,
      first_submit: true
    })
    //改变当前页面渲染
    that.setData({
      chooseInfo:false,
    })
    //上传组织以及user数据库后返回清单页面
    //传入提交的组织unique_code以及清单id
    that.submitUpload(unique_code, that.data.id)
  },
  //返回上一页面
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //分享按钮
  onShareAppMessage() {
    return {
      title: "药清单",
      path: "pages/index/index",
      imageUrl: "https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
    }
  }
})