//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    //用户身份信息
    userInfo: app.globalData.userInfo,
    //组织信息
    group: [],
    //用户身份和权限
    permission: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this
    var unique_code = options.unique_code
    var index = options.index
    console.log('【获取到的唯一识别码】', unique_code)
    //用唯一识别码从数据库中获取信息
    await db.collection('groups_table')
      .where({
        unique_code: unique_code
      }).get().then(res => {
        console.log('【从服务器中获取到的组织信息】', res)
        var group = res.data[0]
        //获取用户身份和权限，若权限在遍历后仍未0，说明该用户未加入过
        var permission = '0'
        var joined_groups = app.globalData.userInfo.joined_groups
        //遍历用户加入的组织
        for (let i = 0; i < joined_groups.length; i++) {
          if (joined_groups[i].unique_code == unique_code) {
            permission = joined_groups[i].permission
          }
        }

        that.setData({
          userInfo: app.globalData.userInfo,
          group: group,
          permission: permission,
          index: index,
        })
      })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //判断个人信息是否填写完毕
  is_fill_userInfo(){
    var userInfo=app.globalData.userInfo
    if (userInfo.address.building == "" || userInfo.address.no == "" || userInfo.address.room == "" || userInfo.gender == "" || userInfo.real_name == "" || userInfo.phone_number == ""||userInfo.id_number=='') {
      wx.showModal({
        title: '提示',
        content: '请完善您的个人信息后再加入组织！',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //跳转到个人信息页面
            wx.navigateTo({
              url: '../personnalInfo/personalInfo',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            return false
          }
        }
      })
    }
    return true
  },
  //加入、退出、解散组织
  async changeJoinState() {
    var that = this
    //保存原有权限
    var permission = that.data.permission
    wx.showModal({
      title: '提示',
      content: '您真的要这样做吗？',
      success(res) {
        if (res.confirm) {
          //用户选择进行加入或退出或解散操作
          console.log('用户点击确定')
          that.setData({
            permission: permission == '0' ? '1' : '0',
          })
          //提前准备好openid、unique_code等参数，方便后续再数据库中查找
          var userInfo = that.data.userInfo
          var unique_code = that.data.group.unique_code
          var openid = userInfo.openid
          //后端实现加入、退出、解散

          //若为未加入的人，则加入组织
          if (permission == 0) {
            //首先判断其个人信息是否填写完毕，因为后续需要用到真实姓名等信息
            //若个人信息未填写完整，则引导其完善个人信息
            if(!that.is_fill_userInfo())return
            wx.showToast({
              title: '加入组织成功!',
              icon: 'success',
              duration: 1000
            })
            //上传数据库
            //数据库中加入该组织的成员列表,同时更新加入成员数量
            var person = {}
            person.name = userInfo.real_name
            person.openid = userInfo.openid
            console.log('【unique_code】',unique_code)

            db.collection('groups_table').where({
              unique_code: unique_code
             }).update({
              data:{
                member_list:_.push(person),
                members_number: _.inc(1) 
              }
            }).then(res=>{
              console.log('【更新组织的成员列表】',res)
            })
            //user表中增加组织以及权限，权限默认为1，代表普通加入者
            //构造加入的组织简略数据
            var group = that.data.group
            var new_group = {}
            new_group.address = group.address
            new_group.name = group.name
            new_group.permission = '1'
            new_group.unique_code = group.unique_code
            //上传user数据库
            db.collection('user').where({
              openid: openid
            }).update({
              data: {
                joined_groups: _.push(new_group)
              }
            }).then(res=>{
              console.log('【user表更新】',res)
            })
            //更新全局userInfo中的joined_groups
            app.globalData.userInfo.joined_groups.push(new_group)

          } else if (permission == 1 || permission == 2) {
            //若为已加入或为管理员，则退出组织
            wx.showToast({
              title: '成功退出组织！',
              icon: 'success',
              duration: 1000
            })
            //数据库user中删除
            db.collection('user').where({
              openid: openid
            }).update({
              data: {
                joined_groups: _.pull({
                  unique_code: _.eq(unique_code),
                }),
              }
            })
            //数据库中的组织成员列表中删除
            db.collection('groups_table').where({
              unique_code: unique_code
            }).update({
              data: {
                member_list: _.pull({
                  openid: _.eq(openid),
                }),
                members_number: _.inc(-1) //人数减少
              }
            })
            //若为管理员，还需从管理员列表中删除
            if (permission == 2) {
              db.collection('groups_table').where({
                unique_code: unique_code
              }).update({
                data: {
                  administrator_list: _.pull({
                    openid: _.eq(openid),
                  })
                }
              })


            }
            //更新全局userInfo
            for (let i = 0; i < userInfo.joined_groups.length; i++) {
              if (userInfo.joined_groups[i].unique_code == unique_code) {
                userInfo.joined_groups.splice(i, 1)
                break;
              }
            }
            app.globalData.userInfo = userInfo

          } else {
            //若为创建人,则删除小区，对于所有加入的人来说，不用删除，在列举加入的组织时只要不显示null的就行，显著降低读写次数
            //从数据库中删除数据
            //首先删除所有加入的用户的joined_group数组中的相关元素
            var member_list = that.data.group.member_list
            console.log(member_list)
            for (let i = 0; i < member_list.length; i++) {
              db.collection('user').where({
                openid: member_list[i].openid
              }).update({
                data: {
                  joined_groups: _.pull({
                    unique_code: _.eq(unique_code),
                  })
                }
              })
            }
            //随后删除该组织
            db.collection('groups_table').where({
              unique_code: unique_code
            }).remove().then(res => {
              console.log('【删除组织成功！】', res)
            })
            //更新全局userInfo
            var userInfo = app.globalData.userInfo
            for (let i = 0; i < userInfo.joined_groups.length; i++) {
              if (userInfo.joined_groups[i].unique_code == unique_code) {
                userInfo.joined_groups.splice(i, 1)
                break;
              }
            }
            app.globalData.userInfo = userInfo
            wx.showToast({
              title: '成功解散组织！',
              icon: 'success',
              duration: 1000
            })
            //延迟返回
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 500)
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //back函数
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //页面销毁时触发函数
  onUnload(){
    //重新渲染上一个页面
    var pages = getCurrentPages()
    var prepage = pages[pages.length - 2]
    prepage.change()
  },

  //分享
  onShareAppMessage() {

  }
})