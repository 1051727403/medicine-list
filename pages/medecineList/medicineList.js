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
    //个人信息
    userInfo: {},
    //是否点击增加药品
    clickAddMedicineButtom: false,
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
          number:0,
        }
      ],
    },
  },
    //ONLOAD第一次进入该页面
    onLoad:function(options) {
      var that = this
      //获取传输数据
      const eventchannel = this.getOpenerEventChannel()
      eventchannel.on('translate', data => {
        console.log('【onload传输进该页面的数据】', data)
        that.setData({
          //list: data.data,
          windowWidth: app.globalData.windowWidth,
          userInfo: app.globalData.userInfo,
        })
      })
      console.log('windowWidth:', that.data.windowWidth)

    },
  //退出该页面保存当前所记录的所有
  onUnload() {


  },
  //点击增加清单后显示新增界面
  addMedicine() {
    this.setData({
      clickAddMedicineButtom: this.data.clickAddMedicineButtom == true ? false : true,
    })
  },
  //扫描条形码添加药品
  add_scan() {
    wx.scanCode({
      onlyFromCamera: false,
      success(res) {
        console.log('扫描条形码的结果', res)
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