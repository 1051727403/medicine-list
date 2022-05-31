//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    //屏幕宽度
    windowWidth: app.globalData.windowWidth,
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //清单名称
    name: '',
    //清单
    list: [],
    //用户信息
    userInfo: {},
    //在上一页面中所属的下标
    index: '',
  },
  //删除上一页面的对应index的清单
  del_prePage() {
    var that = this
    var index = this.data.index
    var pages = getCurrentPages()
    var prePage = pages[pages.length - 2]
    var checked_medicine_list = prePage.data.checked_medicine_list
    checked_medicine_list.splice(index, 1)
    prePage.setData({
      checked_medicine_list: checked_medicine_list
    })
  },
  //获取时间，返回格式化的时间
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
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this
    var id = options.id
    var name = options.list_name
    var index = options.index
    var unique_code = options.unique_code
    var openid
    var list = []
    var userInfo = {}
    this.setData({
      name: name,
      index: index,
      unique_code: unique_code,
    })

    //获取清单信息
    await db.collection('list_table').where({
      id: id
    }).get().then(res => {
      console.log('【获取到的清单信息】', res.data[0])
      if (res.data[0] == null) {
        console.log('该清单已被完成!')
        wx.showToast({
          title: '该清单已被完成!',
          icon: 'error',
          duration: 3000
        })
        //改变上一页面中的清单
        that.del_prePage()
        setTimeout(function () { 
          wx.navigateBack({
          delta: 1,
        })
      }, 3000)
       
        return
      }
      list = res.data[0]
      openid = res.data[0].openid
    })
    console.log(openid)
    //获取清单所属的个人信息
    await db.collection('user').where({
      openid: openid
    }).get().then(res => {
      console.log('【获取到的清单所属的用户信息】', res.data[0])
      userInfo = res.data[0]
      that.setData({
        list: list,
        userInfo: userInfo
      })
    })


  },

  //返回上一页面
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //清单完成
  async pass() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认完成该配药清单？',
      confirmColor: "#33d13e",
      success(res) {
        if (res.confirm) {
          console.log('【审核通过，用户点击确定】')
          that.del_prePage()
          //改变数据库中的清单表该清单的状态
          var id = that.data.list.id
          db.collection('list_table').where({
            id: id
          }).update({
            data: {
              status:3
            }
          }).then(res=>{
            console.log('【成功改变数据库中清单状态状态】',res)
          })
          //删除数据库中的已审核列表中对应的数据项
          var unique_code = that.data.unique_code
          db.collection('checked_medicine_list_table').where({
            unique_code:unique_code,
            id: id
          }).remove().then(res => {
            console.log('【从待审核表中删除！】', res)
          })
          //加入到已完成列表中
          var completed_medicine_list = {
            id: id,
            list_name: that.data.name,
            complete_time: that.getNowTime(),
            user_name: that.data.userInfo.real_name,
            unique_code: unique_code
          }
          db.collection('completed_medicine_list_table').add({
            data: completed_medicine_list
          }).then(res => {
            console.log('【添加到已完成列表成功！】', res)
          })
          //组织完成清单数+1
          var deal_number=0
          db.collection('groups_table').where({
            unique_code : unique_code
          }).get().then(res => {
            deal_number = res.data[0].deal_number
          })
          deal_number++
          console.log(deal_number)
          db.collection('groups_table').where({
            unique_code : unique_code
          }).update({
            data: {
              deal_number : deal_number+1
            }
          }).then(res=>{
            console.log('【成功改变数据库中完成清单数量】',res)
          })
          //提示反馈用户并返回上一页
          wx.showToast({
            title: '审核通过！',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1,
            })
          },1000)
          
          
        } else if (res.cancel) {
          console.log('【审核通过按钮，用户点击取消】')
          return
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})