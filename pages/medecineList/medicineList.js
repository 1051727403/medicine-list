// pages/medecineList/medicineList.js
const app = getApp()
wx.cloud.init({
  env: 'cloud-list-4gpfd3rebac5d193',
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
      })
    })
    console.log('windowWidth:', that.data.windowWidth)
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
    //将数据传输回去进行渲染，可以减少show函数中查询数据库的操作
    var transport_list = that.data.list
    console.log(transport_list)
    wx.navigateTo({
      url: '../',
      success(res) {
        res.eventChannel.emit('translate', {
          data: transport_list
        })
      }
    })
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
    })
    console.log('【自定义手动添加药品成功！】', that.data.list.medicine)
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
        wx.request({
          url: 'https://www.mxnzp.com/api/barcode/goods/details',
          method: 'GET',
          data: {
            'barcode': code,
            'app_id': 'hvhmohepuqlrinmo',
            'app_secret': 'TCtyRTduSjZNUGhHaGl3K3R5ejhHUT09',
          },
          success: res => {
            console.log('【免费api查询结果】：', res)
            that.setData({
              clickAddMedicineButtom: false
            })
            if (res.data.code != 1) {
              console.log('【免费api中未能查询到该药品】')
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
              console.log('【免费api查询药品成功！】')
              //获取的药品信息
              var medicine_data = res.data.data
              //构造药品信息
              var new_medicine = {}
              new_medicine.name = medicine_data.goodsName
              new_medicine.brand = medicine_data.brand
              new_medicine.specification = medicine_data.standard
              new_medicine.url = noPhoto_url
              new_medicine.number = 0
              console.log('【新构造的药品信息】:', new_medicine)
              //更新清单列表&渲染页面
              //原本的药品清单
              var medicine_list = that.data.list.medicines
              console.log(medicine_list)
              medicine_list.unshift(new_medicine)
              that.setData({
                ['list.medicines']: medicine_list,
                clickAddMedicineButtom: false
              })
              console.log('扫码添加药品成功!', that.data.list.medicines)
              return
            }
          }
        })
        /*调用接口api获取药品详细信息 end*/
      },
      fail: res => {
        console.log('【调用扫码失败】', res)
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
  //右上角分享按钮，分享小程序
  onShareAppMessage() {
    return {
      title: "药清单",
      path: "pages/index/index",
      imageUrl: "https://img-blog.csdnimg.cn/812e2d8f0da047089ee24abaf831ae2e.png#pic_center"
    }
  }
})