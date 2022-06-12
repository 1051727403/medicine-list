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
    //待完成药品清单
    checked_medicine_list:[]
  },
  onLoad(options) {
    var that=this
    var unique_code=options.unique_code
    db.collection('checked_medicine_list_table').where({
      unique_code:unique_code
    }).get().then(res=>{
      console.log('【获取所有待审核的清单】',res.data)
      var checked_medicine_list=res.data
      that.setData({
        checked_medicine_list:checked_medicine_list,
        unique_code:unique_code
      })
    })


  },
  //跳转到审核清单页面
  jumoToAuditListPage(res){
    var that=this
    console.log('选择进行查看的清单',res)
    var index=res.currentTarget.dataset.index
    var id=that.data.checked_medicine_list[index].id
    var list_name=that.data.checked_medicine_list[index].list_name
    var unique_code=that.data.unique_code
    wx.navigateTo({
      url: '/pages/viewMedicinesChecked/viewMedicinesChecked?id='+id+'&list_name='+list_name+"&index="+index+"&unique_code="+unique_code,
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

  async Output() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认导出为excel吗？导出后可点击右上角选项栏进行保存',
      confirmColor: "#33d13e",
      success(res) {
        if (res.confirm) {
          console.log('【用户点击确定】')
          wx.showLoading({
            title: '文件下载中',
            mask:true,
          })
          
          wx.cloud.callFunction({
            name: 'ExportListToExcel',
            data: {
              unique_code: that.data.unique_code
            },
            success(res) {
              console.log(res)
              var fileID = res.result.fileID
              console.log(fileID)
              wx.cloud.downloadFile({
                fileID: fileID,
                success: res => {
                  console.log("文件下载成功", res);
                    wx.hideLoading()       
                  //提示框
                  wx.showToast({
                    title: '文件下载成功',
                    icon: "success",
                    duration: 2000
                  })
                  //打开文件
                  const filePath = res.tempFilePath
                  wx.openDocument({
                    filePath: filePath,
                    showMenu: true,
                    success: function (res) {
                      console.log('打开文档成功', res)
                      //删除云端存档
                      wx.cloud.deleteFile({
                        fileList:[fileID],
                        success:res=>{
                          console.log("删除成功",res)
                        },
                        fail:err=>{
                          console.log("删除失败",err)
                        }
                      })
                    }
                  })
                },
                fail: err => {
                  console.log("文件下载失败", err);
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})