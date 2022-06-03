//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  onLoad(options) {

  },

  back(){
    wx.navigateBack({
      delta: 1,
    })
  },
  onShareAppMessage() {

  }
})