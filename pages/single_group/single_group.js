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
    //用户身份信息
    userInfo: app.globalData.userInfo,
    //用户点击修改组织信息
    clickModifyInfo:false,
    //在上一页中的下标
    index:-1,
    //组织信息
    group: [],
    //用户身份和权限
    permission: '0',
    //新的组织名称
    new_name:'',
    //新的组织联系电话
    new_phone:'',
    //新的组织介绍
    new_introduction:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this
    var unique_code = options.unique_code
    var index=options.index
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
        console.log(joined_groups)
        //遍历用户加入的组织
        for (let i = 0; joined_groups!=null&&i < joined_groups.length; i++) {
          if (joined_groups[i].unique_code == unique_code) {
            permission = joined_groups[i].permission
          }
        }

        that.setData({
          index:index,
          userInfo: app.globalData.userInfo,
          group: group,
          permission: permission,
          new_name:group.name,
          new_phone:group.phone_number,
          new_introduction:group.introduction
        })
      })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //跳转到成员管理页面
  JumpToManageMembers() {
    var that = this
    wx.navigateTo({
      url: '/pages/manageMembers/manageMembers?unique_code=' + that.data.group.unique_code,
      success(res) {
        res.eventChannel.emit('translate', {
          data: that.data.group.member_list
        })
      }
    })
  },
  //跳转到审核页面，携带该组织的唯一识别码参数
  audit() {
    var that = this
    wx.navigateTo({
      url: '/pages/audit/audit?unique_code=' + that.data.group.unique_code,
    })
  },
  //跳转到查看页面，携带该组织的唯一识别码参数
  ToViewList() {
    var that = this
    wx.navigateTo({
      url: '/pages/viewListsType/viewListsType?unique_code=' + that.data.group.unique_code,
    })
  },
  //判断个人信息是否填写完毕
  is_fill_userInfo() {
    var userInfo = app.globalData.userInfo
    console.log('判断个人信息是否完整?', userInfo)
    if ( userInfo.address.no == "" || userInfo.address.room == "" || userInfo.real_name == "" || userInfo.phone_number == "" || userInfo.id_number == '') {
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
          }
        }
      })
      console.log('【个人信息不完整】')
      return false
    }
    console.log('【个人信息完整】')
    return true
  },
  //加入、退出、解散组织
  changeJoinState() {
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
          //提前准备好openid、unique_code等参数，方便后续再数据库中查找
          var userInfo = that.data.userInfo
          var unique_code = that.data.group.unique_code
          var openid = userInfo.openid
          //后端实现加入、退出、解散

          //若为未加入的人，则加入组织
          if (permission == 0) {
            //首先判断其个人信息是否填写完毕，因为后续需要用到真实姓名等信息
            //若个人信息未填写完整，则引导其完善个人信息
            if (that.is_fill_userInfo() == false) return
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
            person.permission = 1
            person.phone_number = userInfo.phone_number
            console.log('【unique_code】', unique_code)

            db.collection('groups_table').where({
              unique_code: unique_code
            }).update({
              data: {
                member_list: _.push(person),
                members_number: _.inc(1)
              }
            }).then(res => {
              console.log('【更新组织的成员列表】', res)
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
            }).then(res => {
              console.log('【user表更新】', res)
            })
            //更新全局userInfo中的joined_groups
            app.globalData.userInfo.joined_groups.push(new_group)
            that.setData({
              permission:'1',
            })
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
            //更新全局userInfo
            for (let i = 0; i < userInfo.joined_groups.length; i++) {
              if (userInfo.joined_groups[i].unique_code == unique_code) {
                userInfo.joined_groups.splice(i, 1)
                break;
              }
            }
            app.globalData.userInfo = userInfo
            that.setData({
              permission: '0',
            })
          } else {
            console.log('用户为创建者')
            //若为创建人,则删除小区，对于所有加入的人来说，不用删除，在列举加入的组织时只要不显示null的就行，显著降低读写次数
            //若组织中存在需要审核以及需要完成的清单，则不能解散组织
            //检查是否存在提交的清单
            var submit_num = 0
            db.collection('submitted_medicine_list_table').where({
              unique_code: unique_code
            }).get().then(res => {
              console.log('【组织内待审核的清单数量】', res)
              submit_num = res.data.length
              console.log(submit_num)
              if (submit_num != 0) {
                wx.showToast({
                  title: '存在待审核的清单，不可解散！',
                  icon: 'none',
                  mask: true,
                  duration: 2000
                })
                that.setData({
                  permission: '3',
                })
                return
              }
              //待完成的清单
              var to_complete_num = 0
              db.collection('checked_medicine_list_table').where({
                unique_code: unique_code
              }).get().then(res => {
                console.log('【组织内待完成的清单数量】', res)
                to_complete_num = res.data.length
                if (to_complete_num != 0) {
                  wx.showToast({
                    title: '存在未完成的清单，不可解散！',
                    icon: 'none',
                    mask: true,
                    duration: 2000
                  })
                  that.setData({
                    permission: '3',
                  })
                  return
                } else {
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
                  //删除完成列表中该组织的内容
                  db.collection('completed_medicine_list_table').where({
                    unique_code:unique_code
                  }).remove().then(res=>{
                    console.log('【解散组织删除所有已完成的清单信息,节省数据库空间】',res)
                  })
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
                  that.setData({
                    permission: '0',
                  })
                  //延迟返回
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 500)
                }
              })
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //修改组织信息
  modify_group_info(){
    var that=this
    this.setData({
      clickModifyInfo:true
    })
  },
  //获取新的组织名称
  modifyGroupInfo_name(res){
    this.setData({
      new_name:res.detail.value,
    })
  },
  //获取新的组织联系电话
  modifyGroupInfo_phone(res){
    this.setData({
      new_phone:res.detail.value,
    })
  },
  //获取新的组织介绍
  modifyGroupInfo_introduction(res){
    this.setData({
      new_introduction:res.detail.value,
    })
  },
  //取消修改
  modify_cancle(){
    var that=this
    this.setData({
      clickModifyInfo:false,
      new_name:that.data.group.name,
      new_phone:that.data.group.phone_number,
      new_introduction:that.data.group.introduction,
    })
  },
  //确认修改
  modify_confirm(){
    var that=this
    var new_name=that.data.new_name
    var new_phone=that.data.new_phone
    var new_introduction=that.data.new_introduction
    if(new_name.match(/^[ ]+$/)||new_name==''){
      wx.showToast({
        title: '名称不能为空！',
        icon: 'error',
        duration: 2000
      })
      return
    }else if(new_phone.length!=11){
      wx.showToast({
        title: '电话号码不足11位！',
        icon: 'none',
        duration: 2000
      })
      return
    }else{
      //渲染页面
      that.setData({
        clickModifyInfo:false,
        ['group.name']:new_name,
        ['group.phone_number']:new_phone,
        ['group.introduction']:new_introduction
      })
      //渲染上一个页面
      var index=that.data.index
      var pages=getCurrentPages()
      var prePage=pages[pages.length-2]
      var name='groups['+index+'].name'
      prePage.setData({
        [name]:new_name,
      })
      //上传服务器
      var unique_code=that.data.group.unique_code
      db.collection('groups_table').where({
        unique_code:unique_code
      }).update({
        data:{
          name:new_name,
          phone_number:new_phone,
          introduction:new_introduction,
        }
      }).then(res=>{
        console.log('【更新组织信息成功！】')
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 2000
        })
      })
      //更新组织中所有人的组织表中的组织名称
      var member=that.data.group.member_list
      for(let i=0;i<member.length;i++){
        db.collection('user').where({
          openid:member[i].openid,
          'joined_groups.unique_code':unique_code,
        }).update({
          data:{
            'joined_groups.$.name':new_name,
          }
        }).then(res=>{
          console.log('【更新用户表中组织名称！】')
        })
      }
    }
  },
  //back函数
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //页面销毁时触发函数
  onUnload() {
    //重新渲染上一个页面
    var pages = getCurrentPages()
    var prepage = pages[pages.length - 2]
    console.log('【prepage】', prepage)
    //如果是通过分享进入，上一页是index页面，则不需要渲染
    if (prepage.route != 'pages/index/index') {
      console.log('【上一页面不是首页，说明不是通过分享进入，不需要渲染】')
      prepage.change()
    }
  },

  //分享小程序
  onShareAppMessage(res) {
    var that = this
    //若点击分享按钮进行分享，将该页面数据封装后作为参数传递，好友点击后根据参数渲染
    if (res.from == 'button') {
      console.log('【点击按钮进行分享】')
      //封装该页面所有信息
      return {
        title: "药清单·分享组织",
        //先进index以执行登录验证
        path: "pages/index/index?shareGroup=" + that.data.group.unique_code,
        imageUrl: "https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
      }
    } else {
      return {
        title: "药清单",
        path: "pages/index/index",
        imageUrl: "https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
      }
    }
  }
})