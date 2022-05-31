//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    //组织唯一码
    unique_code:'',
    //已完成药品清单
    completed_medicine_list:[]
  },
  onLoad(options) {
    var that=this
    var unique_code=options.unique_code
    db.collection('completed_medicine_list_table').where({
      unique_code:unique_code
    }).get().then(res=>{
      console.log('【获取所有已完成的清单】',res.data)
      var completed_medicine_list=res.data
      that.setData({
        completed_medicine_list:completed_medicine_list,
        unique_code:unique_code
      })
    })


  },
  //跳转到审核清单页面
  jumoToAuditListPage(res){
    var that=this
    console.log('选择进行查看的清单',res)
    var index=res.currentTarget.dataset.index
    var id=that.data.completed_medicine_list[index].id
    var list_name=that.data.completed_medicine_list[index].list_name
    var unique_code=that.data.unique_code
    wx.navigateTo({
      url: '/pages/viewMedicines3/viewMedicines3?id='+id+'&list_name='+list_name+"&index="+index+"&unique_code="+unique_code,
    })
  },
  //返回上一页面
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  onShow(){
  },






  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})