//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const command = db.command
Page({
  data: {
    submitted_medicine_list:[]
  },
  onLoad(options) {
    var that=this
    var unique_code=options.unique_code
    db.collection('submitted_medicine_list_table').where({
      unique_code:unique_code
    }).get().then(res=>{
      console.log('【获取所有待审核的清单】',res.data)
      var submitted_medicine_list=res.data
      that.setData({
        submitted_medicine_list:submitted_medicine_list
      })
    })


  },
  //跳转到审核清单页面
  jumoToAuditListPage(res){
    var that=this
    console.log('选择进行审核的清单',res)
    var index=res.currentTarget.dataset.index
    var id=that.data.submitted_medicine_list[index].id
    var list_name=that.data.submitted_medicine_list[index].list_name
    wx.navigateTo({
      url: '/pages/audit_list_page/audit_list_page?id='+id+'&list_name='+list_name,
    })
  },
  //返回上一页面
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },







  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})