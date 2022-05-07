//注：
//1、每次更新采用删除当前数据后再加入其，这样就能将其放到最后，在遍历数据库时只要逆序就能获得按时间排序后的清单

//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'cloud-list-4gpfd3rebac5d193',
})
const db = wx.cloud.database()
var openid
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //用户信息
    userInfo: app.globalData.userInfo,
    //是否点击增加清单
    clickAddListButtom: false,
    //用户点击确认增加清单，控制数组第一项进行渲染
    is_add_confirm: false,
    //第一次加载，控制所有list进行动画渲染(只有在老用户重复登录时才需要将所有列表渲染)
    is_first_show: false,
    //是否点击重命名
    clickRenameListButtom: false,
    //是否点击修改选项
    is_modify: 0,
    //新增清单名称
    ListName: "药品清单",
    //是否显示提示登录框（是否为新用户,1是，0不是）
    new_user: false,
    //点击修改图标时点击的下标
    modifyIndex: -1,
    //清单列表
    medicineList: [{
      //样品
      name: '药品清单',
      lastModifyTime: '2022.04.28    24:00',
      status: 0,
      _id: '',
    }],

  },
  //复用型函数
  //检测是否登录
  islogined() {
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        confirmColor: "#0ed81b"
      })
      return false
    }
    return true
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
  //获取用户的所有清单函数,并更新
  async getTotalList(openid) {
    var that = this
    //一次查询上限为100，因此需要分批次取出
    const MAX_LIMIT = 100
    const countResult = await db.collection('list_table').count()
    const total = countResult.total
    const times = Math.ceil(total / MAX_LIMIT)
    var medicineList = []
    for (let i = 0; i < times; i++) {
      await db.collection('list_table')
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .where({
          openid: openid
        })
        .get().then(res => {
          //由于添加数据时均添加到数据库尾部，因此，按照顺序即可按时间从旧到新排序
          console.log('【用户获取清单】', res.data)

          for (let j = 0; j < res.data.length; j++) {
            var item = {}
            //将除了_id和_openid的所有数据打包传入
            item.openid = res.data[j].openid
            item.id = res.data[j].id
            item.name = res.data[j].name
            item.lastModifyTime = res.data[j].lastModifyTime
            item.medicines = res.data[j].medicines
            item.status = res.data[j].status
            medicineList.push(item)
          }
        })
    }
    console.log('【获取的该用户的全部清单】', medicineList)
    //将数组逆序，从新到旧
    medicineList.reverse()
    that.setData({
      medicineList: medicineList,
    })




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
        real_name: '',
        gender: '0', //默认为0，非男非女，男为1，女为2
        id_number: '',
        phone_number: '',
        health_number: '',
        address: {
          area: '',
          building: '',
          no: '',
          room: "",
        },
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
      medicineList: []
    })
    this.add_confirm()
    this.setData({
      ListName: ""
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
    var real_name = ''
    var gender = ''
    var id_number = ''
    var phone_number = ''
    var health_number = ''
    var address = {}
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
          gender = res.data[0].gender
          id_number = res.data[0].id_number
          phone_number = res.data[0].phone_number
          health_number = res.data[0].health_number
          address = res.data[0].address
        }
      })
    //封装
    data.logged = logged
    data.avatarUrl = avatarUrl
    data.is_admin = is_admin
    data.nickname = nickname
    data.signTime = signTime
    data.real_name = real_name
    data.gender = gender
    data.id_number = id_number
    data.phone_number = phone_number
    data.address = address
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
    //获取用户所有清单
    await that.getTotalList(openid)
    that.setData({
      logged: data.logged,
      userInfo: data,
      new_user: false,
      is_first_show: true,
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
      //延迟，读取数据库
      wx.showLoading({
        title: '同步用户信息中...',
        mask: true,
      })
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
          that.judge_logged().then(res => {
            console.log('------------------------------------')
            wx.hideLoading()
            //动画结束后将is_first_show关闭，这样在后续增加清单时便可以将第一个进行动画渲染
            setTimeout(function () {
              that.setData({
                is_first_show: false
              })
            }, 1000)
          })

        }
      })




    } else {
      that.setData({
        new_user: false,
        userInfo: app.globalData.userInfo,
      })
      that.getTotalList(that.data.userInfo.openid)
    }
  },
  //OnShow函数，监视页面
  onShow() {
    var that = this
    if (app.globalData.logged == true) {
      this.setData({
        new_user: false,
        userInfo: app.globalData.userInfo,
        clickAddListButtom: false,
        clickRenameListButtom: false,
        is_modify: 0,
        modifyIndex: -1,
      })
      //延迟，读取数据库
      wx.showLoading({
        title: '同步用户信息中...',
        mask: true,
      })
      console.log('【为防止用户使用手机自带的返回键退出，导致药品信息还未上传服务器便发生show函数读取数据库信息，延迟中------------------------------------】')
      setTimeout(function () {
        that.getTotalList(app.globalData.userInfo.openid).then(res => {
          console.log('------------------------------------')
          wx.hideLoading()
        })
      }, 500)


    }

    //控制显示登录提醒
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
                that.sign(res)
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
            showCancel: true,
            confirmColor: "#07c160",
            success: res => {
              if (res.confirm) {
                console.log('【引导用户完善个人信息，用户点击确定】')
                setTimeout(() => {
                  console.log("【引导用户完善个人信息，为防止过快点击加载不完全，延迟中】");
                  wx.navigateTo({
                    url: '../personnalInfo/personalInfo',
                  })
                }, 500)
              } else {
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
  /*新增清单 start*/
  //点击增加清单后显示新增界面
  addList() {
    if (this.islogined()) {
      this.setData({
        clickAddListButtom: true,
      })
    }
  },
  //监测新增清单的名称
  input(res) {
    this.setData({
      ListName: res.detail.value,
    })
  },
  //新增清单时点击取消
  add_cancle(res) {
    console.log('用户点击取消')
    this.setData({
      clickAddListButtom: false,
    })
  },

  //新增清单上传数据库
  async uploadDatabase(new_data) {
    var that = this
    var res = {}
    //检查参数完整性
    if (new_data.openid == "") {
      console.log('【openid缺失，新增清单无法上传数据库】')
      res.errCode = 1
      res.errMsg = '【openid缺失，新增清单无法上传数据库】'
      //console.log('[res]:',res)
      return res
    }
    //上传
    await db.collection('list_table')
      .add({
        data: new_data,
        success: re => {
          console.log('【上传成功！】', re)
          res.errCode = 0
          res.errMsg = '【上传新增清单成功！】'
        },
        fail: re => {
          res.errCode = 2
          res.errMsg = '【上传清单时发生未知错误】'
        },

      })
    //console.log('[res]:',res)
    return res

  },
  //新增清单时点击确定
  async add_confirm() {
    var that = this
    console.log('用户点击确认')
    if (this.data.ListName == "") {
      wx.showToast({
        title: '请输入清单名称！',
        duration: 2000,
        mask: true,
        icon: "none"
      })
      console.log('提示用户输入清单名称')
      return
    }
    //获取当前时间用于更新
    var now_time = that.getNowTime()
    //利用时间戳+随机数与16进制生成uuid
    var id = new Date().getTime()
    id += (((1 + Math.random()) * 0x10000) | 0).toString(16)
    console.log('【生成uuid】', id)
    var new_data = {
      openid: openid,
      id: id,
      name: this.data.ListName,
      lastModifyTime: now_time,
      status: 0, //0代表什么状态也没有
      medicines: []
    }
    console.log('new_data:', new_data)
    /*该处上传数据库  start*/
    await this.uploadDatabase(new_data)
    //更改页面视图
    var new_list = this.data.medicineList
    console.log('【new_list】', new_list)
    new_list.unshift(new_data)
    this.setData({
      clickAddListButtom: false,
      medicineList: new_list,
      ListName: "",
      is_add_confirm: true,
    })
    /*该处上传数据库  end*/
    //延迟等待数组第一项动画渲染完毕后将is_add_confirm置为false，便于下一次再次渲染动画
    setTimeout(function () {
      that.setData({
        is_add_confirm: false
      })
    }, 1000)
  },
  /*新增清单 end*/

  //右上角修改按钮动画
  modify(res) {
    var index = res.currentTarget.dataset.index
    console.log('点击下标为', index, '的清单的修改图标')
    this.setData({
      is_modify: 1,
      modifyIndex: index
    })
  },
  //点击灰色遮罩后取消当前状态
  back() {
    this.setData({
      is_modify: 2,
      modifyIndex: -1
    })
  },
  //重命名清单时点击取消
  rename_cancle(res) {
    console.log('用户点击取消')
    this.setData({
      clickRenameListButtom: false,
    })
  },
  //重命名，更新数据库
  async updateDataBase(newone) {
    //由于跟醒后在数据库内位置不会放到最后，因此，不能用update更新，而应该先删除，再插入
    var that = this
    //删除
    await db.collection('list_table')
      .where({
        id: newone.id
      }).remove()
      .then(res => {
        console.log('【删除该条数据】', res)
      })
    //插入
    await db.collection('list_table')
      .add({
        data: newone
      }).then(res => {
        console.log('【新增数据】', res)
      })




  },
  //重命名时点击确定
  async rename_confirm() {
    var that = this
    if (this.data.ListName == "") {
      wx.showToast({
        title: '请输入清单名称！',
        duration: 1000,
        mask: true,
        icon: "none"
      })
      console.log('提示用户输入清单名称')
      return
    }
    //获取下表、改变名称和最后修改时间,最后调换顺序
    var modifyIndex = this.data.modifyIndex
    var new_medicineList = this.data.medicineList
    var id = new_medicineList[modifyIndex].id
    var status = new_medicineList[modifyIndex].status
    var medicines = new_medicineList[modifyIndex].medicines

    //构造时间标准格式
    var now_time = that.getNowTime()
    //最新修改时间改变，调换顺序
    new_medicineList.splice(modifyIndex, 1)
    //console.log(new_medicineList)
    var newone = {}
    newone.name = this.data.ListName
    newone.lastModifyTime = now_time
    newone.id = id
    newone.status = status
    newone.medicines = medicines
    newone.openid = openid
    console.log('【newone】', newone)
    new_medicineList.unshift(newone)
    this.setData({
      clickRenameListButtom: false,
      medicineList: new_medicineList,
      ListName: ""
    })
    /*数据库更新   传入唯一标识符*/
    await this.updateDataBase(newone)
  },
  //重命名
  rename() {
    this.setData({
      clickRenameListButtom: true,
      is_modify: 2,
    })
  },
  //删除数据库内的数据
  async delDataBase(id) {
    var that = this
    await db.collection('list_table')
      .where({
        id: id
      }).remove()
      .then(res => {
        console.log('【删除该条数据】', res)
      })
  },
  //删除
  del() {
    this.setData({
      is_modify: 2,
    })
    var that = this
    wx.showModal({
      title: '删除',
      content: '是否确认删除？',
      confirmColor: '#0ed81b',
      success(res) {
        if (res.confirm) {
          console.log('【del删除功能】用户点击确定')
          //在数据库内进行删除
          var id = that.data.medicineList[that.data.modifyIndex].id
          that.delDataBase(id)
          //页面渲染删除
          var new_medicineList = that.data.medicineList
          new_medicineList.splice(that.data.modifyIndex, 1)
          that.setData({
            medicineList: new_medicineList,
            modifyIndex: -1,
            is_modify: 2
          })
        } else if (res.cancel) {
          console.log('【del删除功能】用户点击取消')
        }
      }
    })

  },
  //点击对应清单跳转并将数据传输进页面内
  jumpToList(e) {
    //未登录不会显示
    if (!this.islogined()) return
    //console.log(e)
    var transport_list = e.currentTarget.dataset.list
    console.log(transport_list)
    wx.navigateTo({
      url: '../medicineList/medicineList',
      success(res) {
        res.eventChannel.emit('translate', {
          data: transport_list
        })
      }
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