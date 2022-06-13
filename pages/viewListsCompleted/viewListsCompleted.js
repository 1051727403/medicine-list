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
  async onLoad(options) {
    var that=this
    var unique_code=options.unique_code
    //一次查询上限为20，因此需要分批次取出
    const MAX_LIMIT = 20
    const countResult = await db.collection('completed_medicine_list_table').count()
    const total = countResult.total
    const times = Math.ceil(total / MAX_LIMIT)
    var completed_medicine_list=[]
    for (let i = 0; i < times; i++) {
      await db.collection('completed_medicine_list_table')
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .where({
          unique_code: unique_code
        })
        .get().then(res => {
          //由于添加数据时均添加到数据库尾部，因此，按照顺序即可按时间从旧到新排序
          console.log('【用户获取清单】', res.data)

          for (let j = 0; j < res.data.length; j++) {
            completed_medicine_list.push(res.data[j])
          }
        })
    }
    console.log('【获取全部待完成清单】', completed_medicine_list)
    that.setData({
      completed_medicine_list: completed_medicine_list,
      unique_code: unique_code
    })
    // db.collection('completed_medicine_list_table').where({
    //   unique_code:unique_code
    // }).get().then(res=>{
    //   console.log('【获取所有已完成的清单】',res.data)
    //   var completed_medicine_list=res.data
    //   that.setData({
    //     completed_medicine_list:completed_medicine_list,
    //     unique_code:unique_code
    //   })
    // })
  },
  //跳转到已完成详细清单页面
  jumoToAuditListPage(res){
    var that=this
    console.log('选择进行查看的清单',res)
    var index=res.currentTarget.dataset.index
    var list=that.data.completed_medicine_list[index]
    var unique_code=that.data.unique_code
    var data={}
    data.unique_code=unique_code
    data.list=list
    wx.navigateTo({
      url: '/pages/viewMedicinesCompleted/viewMedicinesCompleted',
      success:res=>{
        res.eventChannel.emit('transform',{
          data:data
        })
      }
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