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
    //待审核药品清单
    submitted_medicine_list:[]
  },
  async onLoad(options) {
    var that=this
    var unique_code=options.unique_code
    //一次查询上限为20，因此需要分批次取出
    const MAX_LIMIT = 20
    const countResult = await db.collection('submitted_medicine_list_table').count()
    const total = countResult.total
    const times = Math.ceil(total / MAX_LIMIT)
    var submitted_medicine_list=[]
    for (let i = 0; i < times; i++) {
      await db.collection('submitted_medicine_list_table')
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .where({
          unique_code: unique_code
        })
        .get().then(res => {
          //由于添加数据时均添加到数据库尾部，因此，按照顺序即可按时间从旧到新排序
          console.log('【用户获取清单】', res.data)

          for (let j = 0; j < res.data.length; j++) {
            submitted_medicine_list.push(res.data[j])
          }
        })
    }
    console.log('【获取全部待完成清单】', submitted_medicine_list)
    that.setData({
      submitted_medicine_list: submitted_medicine_list,
      unique_code: unique_code
    })
    // db.collection('submitted_medicine_list_table').where({
    //   unique_code:unique_code
    // }).get().then(res=>{
    //   console.log('【获取所有待审核的清单】',res.data)
    //   var submitted_medicine_list=res.data
    //   that.setData({
    //     submitted_medicine_list:submitted_medicine_list,
    //     unique_code:unique_code
    //   })
    // })


  },
  //跳转到审核清单页面
  jumoToAuditListPage(res){
    var that=this
    console.log('选择进行审核的清单',res)
    var index=res.currentTarget.dataset.index
    var id=that.data.submitted_medicine_list[index].id
    var list_name=that.data.submitted_medicine_list[index].list_name
    var unique_code=that.data.unique_code
    wx.navigateTo({
      url: '/pages/audit_list_page/audit_list_page?id='+id+'&list_name='+list_name+"&index="+index+"&unique_code="+unique_code,
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