// pages/viewListsType/viewListsType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unique_code:''
  },

  //back函数
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    var uni=options.unique_code
    that.setData({
      unique_code : uni
    })
  },
  //跳转到查看待审核的清单页面
  ToAudit(){
    var that = this
    wx.navigateTo({
      url: '/pages/audit/audit?unique_code=' + that.data.unique_code,
    })
  },
  //跳转到查看待完成的清单页面
  ToAudited(){
    var that = this
    wx.navigateTo({
      url: '/pages/viewListsChecked/viewListsChecked?unique_code=' + that.data.unique_code,
    })
  },
  //跳转到查看已完成的清单页面
  ToComplete(){
    var that = this
    wx.navigateTo({
      url: '/pages/viewListsCompleted/viewListsCompleted?unique_code=' + that.data.unique_code,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})