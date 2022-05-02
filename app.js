// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }
    this.globalData = {
      statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'],
      windowWidth:wx.getSystemInfoSync()['windowWidth'],
      windowHeight:wx.getSystemInfoSync()['windowHeight'],
      screenHeight:wx.getSystemInfoSync()['screenHeight'],
      //初始默认人员信息
      userInfo:{
        nickname:"点击登录",
        avatarUrl: "https://img-blog.csdnimg.cn/45adeb332b2e4d6f9820359d4f091f3f.png#pic_center",
        gender:1,
      },
      logged:false,
    };
  },
  
});
