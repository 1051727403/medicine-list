// pages/single_group/single_group.js
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var unique_code = options.unique_code
    console.log('【获取到的唯一识别码】', unique_code)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //back函数
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //分享
  onShareAppMessage() {

  }
})