// pages/medecineList/medicineList.js
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command
//无图片则使用默认图片，表示无图片
var noPhoto_url = "https://img-blog.csdnimg.cn/819c03d636a84ae49e9e715d87abe95c.png#pic_center"
Page({
  data: {
    //屏幕宽度
    windowWidth: app.globalData.windowWidth,
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    screenHeight: app.globalData.screenHeight,
    //个人信息
    userInfo: {},
    //是否点击增加药品
    clickAddMedicineButtom: false,
    //是否是由back函数退出的（节省一次查询数据库的时间）
    press_back: false,
    //是否按下自定义输入按钮
    clickAddCustom: false,
    //是否点击确认删除
    clickDel: false,
    //新增药品的名称
    add_name: '',
    //新增药品的品牌
    add_brand: '无',
    //新增药品的规格
    add_specification: '无',
    //第一次渲染页面加载动画，和index页面相似
    is_first_show: false,
    //每次新增元素后进行动画渲染
    is_add_confirm: false,
    //移动的元素下标
    moveid: -1,
    //监控x移动程度
    movex: 0,
    //该清单中所包含的所有药品
    list: {
      id: '',
      lastModifyTime: '',
      name: '',
      openid: '',
      status: '',
      medicines: [{
          name: "头孢克圬分散片321654165465441546541",
          url: noPhoto_url,
          specification: "无",
          brand: "无",
          number: 0,
        },
        {
          name: "头孢克圬分散片",
          url: noPhoto_url,
          specification: "无",
          brand: "无",
          number: 0,
        }
      ],
    },
  },
  //ONLOAD第一次进入该页面
  onLoad: function (options) {
    var that = this
    //获取传输数据
    const eventchannel = this.getOpenerEventChannel()
    eventchannel.on('translate', data => {
      console.log('【onload传输进该页面的数据】', data)
      that.setData({
        list: data.data,
        windowWidth: app.globalData.windowWidth,
        userInfo: app.globalData.userInfo,
        statusBarHeight: app.globalData.statusBarHeight,
        windowHeight: app.globalData.windowHeight,
        screenHeight: app.globalData.screenHeight,
        is_first_show: true,
      })
    })
    console.log('windowWidth:', that.data.windowWidth)
    //动画结束后将is_first_show关闭，这样在后续增加清单时便可以将第一个进行动画渲染
    setTimeout(function () {
      that.setData({
        is_first_show: false
      })
    }, 1000)
  },
  show:function(){
    var that=this
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
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
  //离开页面时上传数据库
  async uploadDatabase() {
    var that = this
    //给清单列表页面传值，表示从药品列表页面返回，需要重新加载清单
    var pages = getCurrentPages()
    var prePages = pages[pages.length - 2]
    prePages.setData({
      is_from_medicineList: true,
    })
    //删除原有清单
    await db.collection('list_table')
      .where({
        id: that.data.list.id
      })
      .remove().then(res => {
        console.log('【删除之前的清单】', res)
        //添加新的清单（视为更新）
        var lastModifyTime = that.getNowTime()
        var new_data = that.data.list
        new_data.lastModifyTime = lastModifyTime
        db.collection('list_table')
          .add({
            data: new_data
          }).then(res => {
            console.log('【更新清单成功！】', res)
          })
      })

  },
  //back函数
  async back() {
    if (this.data.press_back == true) return
    var that = this
    this.setData({
      press_back: true
    })
    await that.uploadDatabase()
    wx.navigateBack({
      delta: 1,
    })
    // //为防止数据库未更新完加载不完全，延迟中
    // setTimeout(() => {
    //   console.log("【为防止数据库未更新完加载不完全，延迟中】");
    // }, 500)
  },
  //退出该页面保存当前所记录的所有
  async onUnload() {
    var that = this
    //如果不是按左上角back退出，也需要上传数据库
    if (that.data.press_back == false) {
      await that.uploadDatabase()
      // //为防止数据库未更新完加载不完全，延迟中
      // setTimeout(() => {
      //   console.log("【为防止数据库未更新完加载不完全，延迟中】");
      //   wx.navigateBack({
      //     delta: 1,
      //   })
      // }, 500)
    }
  },
  //点击增加清单后显示新增界面
  addMedicine() {
    this.setData({
      clickAddMedicineButtom: this.data.clickAddMedicineButtom == true ? false : true,
    })
  },
  //增加药品数量
  add(e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    var number = that.data.list.medicines[index].number + 1
    var new_number = "list.medicines[" + index + "].number"
    this.setData({
      [new_number]: number
    })
    console.log("第", index, "个药品数量+1:", number)
  },
  //减少药品数量
  minus(e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    var number = that.data.list.medicines[index].number - 1
    var new_number = 'list.medicines[' + index + '].number'
    this.setData({
      [new_number]: number
    })
    console.log("第", index, "个药品数量-1:", number)
  },
  //自定义手动输入添加药品
  add_custom() {
    var that = this
    this.setData({
      clickAddCustom: true,
      clickAddMedicineButtom: false
    })
  },
  //新增药品的名称
  addMedicine_custom_name(res) {
    this.setData({
      add_name: res.detail.value
    })
  },
  //新增药品的品牌 
  addMedicine_custom_brand(res) {
    this.setData({
      add_brand: res.detail.value
    })
  },
  //新增药品的规格
  addMedicine_custom_specification(res) {
    this.setData({
      add_specification: res.detail.value
    })
  },
  //新增清单时点击取消
  add_cancle(res) {
    console.log('用户点击取消')
    this.setData({
      clickAddCustom: false,
    })
  },
  //新增清单时点击确认，改变页面渲染
  add_comfirm() {
    var that = this
    if (that.data.add_name == '') {
      wx.showToast({
        title: '请输入清单名称！',
        duration: 2000,
        mask: true,
        icon: "none"
      })
      console.log('提示用户输入药品名称')
      return
    }
    var medicine = {}
    medicine.name = that.data.add_name
    medicine.brand = that.data.add_brand
    medicine.specification = that.data.add_specification
    medicine.number = 0
    medicine.url = noPhoto_url
    var list = that.data.list
    list.medicines.unshift(medicine)
    this.setData({
      clickAddCustom: false,
      list: list,
      add_name: '',
      add_brand: '无',
      add_specification: '无',
      clickDel: true,
      is_add_confirm: true,
    })
    console.log('【自定义手动添加药品成功！】', that.data.list.medicine)
    //延迟等待数组第一项动画渲染完毕后将is_add_confirm置为false，便于下一次再次渲染动画
    setTimeout(function () {
      that.setData({
        is_add_confirm: false
      })
    }, 500)
  },
  //扫描条形码添加药品
  async add_scan() {
    var that = this
    var code
    wx.scanCode({
      onlyFromCamera: false,
      success(res) {
        console.log('【扫描条形码的结果】', res)
        code = res.result
        console.log('code:', code)
        /*调用接口api获取药品详细信息 start*/
        /*您的秘钥信息如下：
        app_id:hvhmohepuqlrinmo
        app_secret:TCtyRTduSjZNUGhHaGl3K3R5ejhHUT09
        */
        //     wx.request({
        //       url: 'https://www.mxnzp.com/api/barcode/goods/details',
        //       method: 'GET',
        //       data: {
        //         'barcode': code,
        //         'app_id': 'hvhmohepuqlrinmo',
        //         'app_secret': 'TCtyRTduSjZNUGhHaGl3K3R5ejhHUT09',
        //       },
        //       success: res => {
        //         console.log('【免费api查询结果】：', res)
        //         that.setData({
        //           clickAddMedicineButtom: false
        //         })
        //         if (res.data.code != 1) {
        //           console.log('【免费api中未能查询到该药品】')
        //           wx.showModal({
        //             title: '提示',
        //             content: '很抱歉，未能查询到该药品\n请使用手动方式输入',
        //             showCancel: false,
        //             success(res) {
        //               if (res.confirm == true)
        //                 console.log('用户点击确定')
        //             }
        //           })

        //         } else {
        //           console.log('【免费api查询药品成功！】')
        //           //获取的药品信息
        //           var medicine_data = res.data.data
        //           //构造药品信息
        //           var new_medicine = {}
        //           new_medicine.name = medicine_data.goodsName
        //           new_medicine.brand = medicine_data.brand
        //           new_medicine.specification = medicine_data.standard
        //           new_medicine.url = noPhoto_url
        //           new_medicine.number = 0
        //           console.log('【新构造的药品信息】:', new_medicine)
        //           //更新清单列表&渲染页面
        //           //原本的药品清单
        //           var medicine_list = that.data.list.medicines
        //           console.log(medicine_list)
        //           medicine_list.unshift(new_medicine)
        //           that.setData({
        //             ['list.medicines']: medicine_list,
        //             clickAddMedicineButtom: false
        //           })
        //           console.log('扫码添加药品成功!', that.data.list.medicines)
        //           return
        //         }
        //       }
        //     })
        //     /*调用接口api获取药品详细信息 end*/
        //   },
        //   fail: res => {
        //     console.log('【调用扫码失败】', res)
        //   }


        //直接从国家信息服务平台上调用发现的api
        wx.request({
          url: 'https://bff.gds.org.cn/gds/searching-api/ProductService/ProductListByGTIN?',
          method: 'GET',
          data: {
            SearchItem: code,
            PageSize: 30,
            PageIndex: 1,
          },
          header: {
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkQzQ0QzQzYxRjYyMjE0N0U3MUZDODM2NDI3RDRFOUVGM0M5QzM2RUZSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IjA4MDhZZllpRkg1eF9JTmtKOVRwN3p5Y051OCJ9.eyJuYmYiOjE2NTI2ODAxNDEsImV4cCI6MTY1MjY4Mzc0MSwiaXNzIjoiaHR0cHM6Ly9wYXNzcG9ydC5nZHMub3JnLmNuIiwiY2xpZW50X2lkIjoidnVlanNfY29kZV9jbGllbnQiLCJzdWIiOiIxODkxOTM2IiwiYXV0aF90aW1lIjoxNjUyNjgwMTQwLCJpZHAiOiJsb2NhbCIsInJvbGUiOiJNaW5lIiwiVXNlckluZm8iOiJ7XCJVc2VyTmFtZVwiOm51bGwsXCJCcmFuZE93bmVySWRcIjowLFwiQnJhbmRPd25lck5hbWVcIjpudWxsLFwiR2NwQ29kZVwiOm51bGwsXCJVc2VyQ2FyZE5vXCI6XCLmmoLml6Dkv6Hmga9cIixcIklzUGFpZFwiOmZhbHNlLFwiQ29tcGFueU5hbWVFTlwiOm51bGwsXCJDb21wYW55QWRkcmVzc0NOXCI6bnVsbCxcIkNvbnRhY3RcIjpudWxsLFwiQ29udGFjdFRlbE5vXCI6bnVsbCxcIkdjcExpY2Vuc2VIb2xkZXJUeXBlXCI6bnVsbCxcIkxlZ2FsUmVwcmVzZW50YXRpdmVcIjpudWxsLFwiVW5pZmllZFNvY2lhbENyZWRpdENvZGVcIjpudWxsfSIsIlY0VXNlckluZm8iOiJ7XCJVc2VyTmFtZVwiOlwiczEwNTE3Mjc0MDNcIixcIkVtYWlsXCI6XCIxMDUxNzI3NDAzQHFxLmNvbVwiLFwiUGhvbmVcIjpcIjE1MzQ1ODA5NjczXCIsXCJDYXJkTm9cIjpcIlwifSIsImp0aSI6IjU4MUUyMDJFMzMwQTUwRkI3MkFCRDY1RTkxQUI5Rjg5Iiwic2lkIjoiNDE4RTRBODdGNzQ0NkU5QjY3RTM4ODlDNzhEMjkwREEiLCJpYXQiOjE2NTI2ODAxNDEsInNjb3BlIjpbIm9wZW5pZCJdLCJhbXIiOlsicHdkIl19.cF3cjdYFWPjiy80mfEbRsMJ00PIMZvJP5xI7LuQ0F5q0XGFw2UyKKtKP5vAhDLiiXnZp5hxbZYI896hUScR_yQkZgWF-jgAIG2v9uAroWJbH3nl9u-MkK7XpOHnvPYpPqAc_SreQzAejQw0-JKGyWGyElFuzE1lYhkSaqvVhjjYIwhRatXYMqiy-EOI3u_PQ8Sev5Ih70abu6P6AyijuaKs3z4dxkUvD-s3pNWcrPbRYOHP3m3VDKb6mI8jAAcf_lcttErdJlKx37B5jG0Ey40lN_kncdC-TUCAmfGpsf5vD9Jwy5Qm-X8ODmxm3_-eARJVovTugYYFc_3STPBVBDA',
          },
          success: res => {
            console.log('【国家商品信息服务平台获取的信息】', res)
            console.log('【获取商品信息】', res.data.Data.Items[0])
            //data中存放着商品信息
            var data = res.data.Data.Items[0]
            if (data == null) {
              console.log('【未能查询到该药品】')
              wx.showModal({
                title: '提示',
                content: '很抱歉，未能查询到该药品\n请使用手动方式输入',
                showCancel: false,
                success(res) {
                  if (res.confirm == true)
                    console.log('用户点击确定')
                }
              })
            } else {
              //若无图片，则使用默认图片进行加载
              if (data.picture_filename == null) {
                picture_url = noPhoto_url
              } else {
                console.log('【存在图片：】',data.picture_filename)
                //获取药品图片的网站
                var web_url = 'https://oss.gds.org.cn'
                // //网站上的加密，在最后一个/后面加了一个m
                // var arr=data.picture_filename.split("")
                // for (let i = arr.length - 1; i >= 0; i--) {
                //   if (arr[i] == '/') {
                //     arr.splice(i+1,0,'m')
                //     break
                //   }
                // }
                // data.picture_filename=arr.join("")
                console.log('【处理后的图片网址:】', data.picture_filename)
                var picture_url = web_url + data.picture_filename
                
                //图片过大,压缩图片



              }

              //构造药品信息
              var new_medicine = {}
              new_medicine.name = data.description
              new_medicine.brand = data.brandcn
              new_medicine.specification = data.specification
              new_medicine.url = picture_url
              new_medicine.number = 0
              console.log('【新构造的药品信息】:', new_medicine)
              //更新清单列表&渲染页面
              //原本的药品清单
              var medicine_list = that.data.list.medicines
              console.log(medicine_list)
              medicine_list.unshift(new_medicine)
              that.setData({
                ['list.medicines']: medicine_list,
                clickAddMedicineButtom: false,
                is_add_confirm: true,
              })
              console.log('扫码添加药品成功!', that.data.list.medicines)
              //延迟等待数组第一项动画渲染完毕后将is_add_confirm置为false，便于下一次再次渲染动画
              setTimeout(function () {
                that.setData({
                  is_add_confirm: false
                })
              }, 500)
              return
            }
          },
          fail: res => {
            console.log('【扫码录入失败！】')
          }
        })
      },
      fail: res => {
        console.log('【用户点击取消扫码】', res)
      }
    })

  },
  //监控滑动
  bindMove(e) {
    console.log(e)
    var that = this
    var movex = e.detail.x
    var opacity = 1 / -94 * movex
    this.setData({
      movex: movex,
      opacity: opacity
    })
  },
  //删除药品
  del_medicine(e) {
    var that = this
    console.log(e)
    wx.showModal({
      title: '删除',
      content: '是否确认删除？',
      confirmColor: '#0ed81b',
      success(res) {
        if (res.confirm) {
          console.log('【del_medicine删除功能】用户点击确定')
          //页面渲染删除
          var index = e.currentTarget.dataset.index
          var new_medicineList = that.data.list.medicines
          new_medicineList.splice(index, 1)
          that.setData({
            ['list.medicines']: new_medicineList,
            clickDel: true,
          })
        } else if (res.cancel) {
          console.log('【del删除功能】用户点击取消')
        }
      }
    })
  },
  //提交清单到组织
  submit() {
    wx.showModal({
      title: '提示',
      content: '请问您真的要将该清单提交到组织吗？',
      confirmColor: '#0ed81b',
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //检查用户个人信息是否填写完毕
          var userInfo = app.globalData.userInfo
          console.log("userInfo:", userInfo)
          if (userInfo.address.building == "" || userInfo.address.no == "" || userInfo.address.room == "" || userInfo.gender == "" || userInfo.real_name == "" || userInfo.phone_number == "") {
            wx.showModal({
              title: '提示',
              content: '请完善您的个人信息后再提交！',
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
          } else {
            //若个人信息全部填写完毕则上传数据库，提示提交成功
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })

          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },





  //分享小程序
  onShareAppMessage(res) {
    //若点击分享按钮进行分享，将该页面数据封装后作为参数传递，好友点击后根据参数渲染
    if (res.from == 'button') {
      console.log('【点击按钮进行分享】')
      //封装该页面所有信息

      return {
        title: "药清单",
        path: "pages/medicineList/medicineList",
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