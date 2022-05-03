const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageName:{
      type:String,
      value:" "
    },
    showBackIcon:{
      type:String,
      value:"false"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight:app.globalData.windowHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
