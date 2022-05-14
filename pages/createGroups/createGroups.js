//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
var openid
Page({
  data: {

  },

  onLoad(options) {

  },
  //back函数
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