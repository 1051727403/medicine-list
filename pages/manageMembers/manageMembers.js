//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    //机型
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //组织唯一识别码
    unique_code: '',
    //成员列表
    member_list: [],
    //当前点击改变权限的下标
    index: -1,
  },
  onLoad(options) {
    console.log(options)
    var that = this
    var unique_code = options.unique_code
    const eventchannel = this.getOpenerEventChannel()
    eventchannel.on('translate', data => {
      console.log('【onload传输进该页面的数据】', data)
      var member_list = data.data
      //对成员列表进行排序,将管理员放在前面
      for (let i = 0; i < member_list.length; i++) {
        if (member_list[i].permission == 2) {
          member_list.splice(1, 0, member_list.splice(i, 1)[0])
        }
      }
      that.setData({
        member_list: member_list,
        unique_code: unique_code
      })
    })




  },
  //改变用户权限
  changePermission(e) {
    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index
    var member = that.data.member_list[index]

    if (member.permission == 3) {
      wx.showToast({
        title: '不能更改创建者权限！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      changePermission: true,
      index: index
    })
  },
  //取消更改
  cancel() {
    this.setData({
      changePermission: false
    })
  },
  //取消管理员身份
  cancel_administrator(){
    var that = this
    var index = that.data.index
    var member = that.data.member_list[index]
    var unique_code=that.data.unique_code
    //将该取消管理员权限
    //提示用户再次确认
    wx.showModal({
      title: '提示',
      content: '是否取消该人的管理员权限？',
      success(res) {
        if (res.confirm) {
          console.log('【取消管理员，用户点击确认】')
          //更改其user表中自身的权限,同时检查其是否在组织内，防止出现更改权限但该人已经退出的情况
          db.collection('user').where({
            'openid':member.openid,
            'joined_groups.unique_code':unique_code,
          }).update({
            data:{
              'joined_groups.$.permission':1
            }
          }).then(res=>{
            console.log('【取消管理员，改变user表中权限】', res)
            //该用户不在组织内
            if (res.stats.updated == 0) {
              console.log('【取消管理员，该用户不在组织内】')
              wx.showToast({
                title: '该用户已退出组织！',
                icon: 'none',
                duration: 1000
              })
              //页面渲染中删除该用户
              var member_list = that.data.member_list
              member_list.splice(index,1)
              that.setData({
                member_list: member_list,
                index: -1,
                changePermission: false,
              })
              return
            }
          })
          //更改组织内的权限
          db.collection('groups_table').where({
            unique_code:unique_code,
            'member_list.openid':member.openid
          }).update({
            data:{
              'member_list.$.permission':1
            }
          }).then(res=>{
            console.log('【设置管理员，改变组织表中权限】')
          })
          //渲染页面
          var member_list = that.data.member_list
          member_list[index].permission=1
          that.setData({
            member_list: member_list,
            index:-1,
            changePermission:false,
          })
        } else if (res.cancel) {
          console.log('【设置管理员，用户点击取消】')
        }
      }
    })
    console.log('【成功取消管理员身份！】')
  },
  //设为管理员
  set_administrator() {
    var that = this
    var index = that.data.index
    var member = that.data.member_list[index]
    var unique_code=that.data.unique_code
    //将该人设为管理员
    //提示用户再次确认
    wx.showModal({
      title: '提示',
      content: '是否任命该人为管理员？',
      success(res) {
        if (res.confirm) {
          console.log('【设置管理员，用户点击确认】')
          //更改其user表中自身的权限,同时检查其是否在组织内，防止出现更改权限但该人已经退出的情况
          db.collection('user').where({
            'openid':member.openid,
            'joined_groups.unique_code':unique_code,
          }).update({
            data:{
              'joined_groups.$.permission':2
            }
          }).then(res=>{
            console.log('【设置管理员，改变user表中权限】', res)
            //该用户不在组织内
            if (res.stats.updated == 0) {
              console.log('【设置管理员，该用户不在组织内】')
              wx.showToast({
                title: '该用户已退出组织！',
                icon: 'none',
                duration: 1000
              })
              //页面渲染中删除该用户
              var member_list = that.data.member_list
              member_list.splice(index,1)
              that.setData({
                member_list: member_list,
                index: -1,
                changePermission: false,
              })
              return
            }
          })
          //更改组织内的权限
          db.collection('groups_table').where({
            unique_code:unique_code,
            'member_list.openid':member.openid
          }).update({
            data:{
              'member_list.$.permission':2
            }
          }).then(res=>{
            console.log('【设置管理员，改变组织表中权限】')
          })

          //渲染页面
          var member_list = that.data.member_list
          member_list[index].permission=2
          member_list.splice(1, 0, member_list.splice(index, 1)[0])
          that.setData({
            member_list: member_list,
            index:-1,
            changePermission:false,
          })
        } else if (res.cancel) {
          console.log('【设置管理员，用户点击取消】')
        }
      }
    })
    console.log('【成功设立管理员身份！】')
  },
  //踢出组织
  kickOut() {
    var that = this
    var index = that.data.index
    var member = that.data.member_list[index]
    var unique_code=that.data.unique_code
    //将该取消管理员权限
    //提示用户再次确认
    wx.showModal({
      title: '提示',
      content: '是否确认踢出该成员？',
      success(res) {
        if (res.confirm) {
          console.log('【踢出组织，用户点击确认】')
          //更改其user表中自身的权限,同时检查其是否在组织内，防止出现更改权限但该人已经退出的情况
          db.collection('user').where({
            'openid':member.openid,
          }).update({
            data:{
              joined_groups:_.pull({
                unique_code:_.eq(unique_code)
              }),
            }
          }).then(res=>{
            console.log('【踢出组织，改变user表中权限】', res)
            //该用户不在组织内
            if (res.stats.updated == 0) {
              console.log('【踢出组织，该用户不在组织内】')
              wx.showToast({
                title: '该用户已退出组织！',
                icon: 'none',
                duration: 1000
              })
              //页面渲染中删除该用户
              var member_list = that.data.member_list
              member_list.splice(index,1)
              that.setData({
                member_list: member_list,
                index: -1,
                changePermission: false,
              })
              return
            }
          })
          //更改组织内的权限
          db.collection('groups_table').where({
            unique_code:unique_code,
          }).update({
            data:{
              member_list:_.pull({
                openid:_.eq(member.openid)
              }),
              members_number:_.inc(-1)
            }
          }).then(res=>{
            console.log('【踢出组织，删除组织表中成员】')
          })
          //渲染页面
          var member_list = that.data.member_list
          member_list.splice(index,1)
          that.setData({
            member_list: member_list,
            index:-1,
            changePermission:false,
          })
        } else if (res.cancel) {
          console.log('【踢出组织，用户点击取消】')
        }
      }
    })
    console.log('【成功踢出成员！】')
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