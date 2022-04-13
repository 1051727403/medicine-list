const app = getApp()
wx.cloud.init({
  env: 'cloud1-1g9c7qo36f1aee1e',
})
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight:app.globalData.windowHeight,
    screenHeight:app.globalData.screenHeight,
    //是否点击增加清单
    clickAddListButtom:false, 
    //是否点击修改选项
    is_modify:0,
    //点击修改的选项下标
    modify_index:-1,
    //新增清单名称
    addListName:"",
    medicineList:[
      {
        name:'药品清单',
        lastModifyTime:'2022.04.05    14:00',
        status:0,
        id:'',
      },
      {
        name:'未命名',
        lastModifyTime:'2022.04.04    10:00',
        status:0,
        id:'',
      },
      {
        name:'未命名1',
        lastModifyTime:'2022.03.21    09:00',
        status:1,
        id:'',
      },
      {
        name:'未命名254adaqddwqdqwd416541',
        lastModifyTime:'2022.01.01    07:00',
        status:1,
        id:'',
      },
    ],
    

  },
  onLoad: function (options) {
    console.log('windowHeight:',this.data.windowHeight)
  },
  addList(){
    this.setData({
      clickAddListButtom:true,
    })
  },
  input(res){
    this.setData({
      addListName:res.detail.value,
    })
  },
  cancle(res){
    console.log('用户点击取消')
    this.setData({
      clickAddListButtom:false,
    })
  },
  comfirm(res){
    console.log('用户点击确认')
    if(this.data.addListName==""){
      wx.showToast({
        title: '请输入清单名称！',
        duration: 2000,
        mask:true,
        icon:"none"
      })
      console.log('提示用户输入清单名称')
      return
    }
    


    var date=new Date
    var year=date.getFullYear()
    var month=date.getMonth()
    month=(month/10<1)?'0'+month:month
    var day=date.getDay()
    day=(day/10<1)?'0'+day:day
    var hour=date.getHours()
    hour=(hour/10<1)?'0'+hour:hour
    var minutes=date.getMinutes()
    minutes=(minutes/10<1)?'0'+minutes:minutes

    var now_time=year+'.'+month+'.'+day+'   '+hour+'.'+minutes
    console.log(now_time)             
    //时间戳表示id      
    var id=date.getTime()             
    console.log('id:',id)
    var new_data={
      name:this.data.addListName,
      lastModifyTime:now_time,
      status:0,
      id:id
    }
    /*该处上传数据库  start*/



    /*该处上传数据库  end*/
    console.log('new_data:',new_data)
    var new_list=this.data.medicineList
    new_list.unshift(new_data)





    this.setData({
      clickAddListButtom:false,
      medicineList:new_list,
      addListName:""
    })
  },
  //左上角修改按钮
  modify(){
    this.setData({
      is_modify:1,
    })
  },
  back(){
    this.setData({
      is_modify:2,
    })



  },






  //分享按钮
  onShareAppMessage(res) {
    if (res.from === 'button') console.log(res)
    return {
      title: "药品清单",
      path: "/pages/index/index",
    }
  }
})