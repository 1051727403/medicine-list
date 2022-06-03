//配置云环境
const app = getApp()
wx.cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const db = wx.cloud.database()
const _ = db.command
var openid
//省和相应的市，后来发现picker里有.....
var provinces = [{
  name: '安徽省',
  index: 0
}, {
  name: '澳门特别行政区',
  index: 1
}, {
  name: '北京市',
  index: 2
}, {
  name: '重庆市',
  index: 3
}, {
  name: '福建省',
  index: 4
}, {
  name: '甘肃省',
  index: 5
}, {
  name: '广东省',
  index: 6
}, {
  name: '广西壮族自治区',
  index: 7
}, {
  name: '贵州省',
  index: 8
}, {
  name: '海南省',
  index: 9
}, {
  name: '河北省',
  index: 10
}, {
  name: '河南省',
  index: 11
}, {
  name: '黑龙江省',
  index: 12
}, {
  name: '湖北省',
  index: 13
}, {
  name: '湖南省',
  index: 14
}, {
  name: '吉林省',
  index: 15
}, {
  name: '江苏省',
  index: 16
}, {
  name: '江西省',
  index: 17
}, {
  name: '辽宁省',
  index: 18
}, {
  name: '内蒙古自治区',
  index: 19
}, {
  name: '宁夏回族自治区',
  index: 20
}, {
  name: '青海省',
  index: 21
}, {
  name: '山东省',
  index: 22
}, {
  name: '山西省',
  index: 23
}, {
  name: '陕西省',
  index: 24
}, {
  name: '上海市',
  index: 25
}, {
  name: '四川省',
  index: 26
}, {
  name: '台湾省',
  index: 27
}, {
  name: '天津省',
  index: 28
}, {
  name: '西藏自治区',
  index: 29
}, {
  name: '香港特别行政区',
  index: 30
}, {
  name: '新疆维吾尔自治区',
  index: 31
}, {
  name: '云南省',
  index: 32
}, {
  name: '浙江省',
  index: 33
}]
var cities = [
  ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市', '其他'],
  ['澳门', '离岛', '其他'],
  ['北京市'],
  ['重庆市'],
  ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市', '其他'],
  ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏', '甘南', '其他'],
  ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '东沙群岛', '潮州市', '揭阳市', '云浮市', '其他'],
  ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市', '其他'],
  ['贵阳市', '六盘水市', '遵义市', '安顺市', '铜仁市', '黔西南', '毕节市', '黔东南', '黔南', '其他'],
  ['海口市', '三亚市', '三沙市', '五指山市', '琼海市', '儋州市', '文昌市', '万宁市', '东方市', '定安县', '屯昌县', '澄迈县', '临高县', '白沙', '昌江', '乐东', '陵水', '保亭', '琼中', '其他'],
  ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市', '其他'],
  ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '济源市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '其他'],
  ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区', '其他'],
  ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施', '仙桃市', '潜江市', '天门市', '神农架林区', '其他'],
  ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西', '其他'],
  ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边', '其他'],
  ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市', '其他'],
  ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市', '其他'],
  ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '盘锦市', '朝阳市', '葫芦岛市', '其他'],
  ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟', '其他'],
  ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市', '其他'],
  ['西宁市', '海东市', '海北', '黄南', '海南', '果洛', '玉树', '海西', '其他'],
  ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市', '其他'],
  ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市', '其他'],
  ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市', '其他'],
  ['上海市'],
  ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝', '甘孜', '凉山', '其他'],
  ['台北市', '高雄市', '台南市', '台中市', '金门县', '南投县', '基隆市', '新竹市', '嘉义市', '新北市', '宜兰县', '新竹县', '桃园县', '苗栗县', '彰化县', '嘉义县', '云林县', '屏东县', '台东县', '花莲县', '澎湖县', '连江县', '其他'],
  ['天津市'],
  ['拉萨市', '昌都地区', '山南地区', '日喀则地区', '那曲地区', '阿里地区', '林芝地区', '其他'],
  ['香港岛', '新界', '其他'],
  ['乌鲁木齐市', '克拉玛依市', '吐鲁番地区', '哈密地区', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁', '塔城地区', '阿勒泰地区', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市', '其他'],
  ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆', '其他'],
  ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市', '其他'],
]
Page({
  data: {
    //用户个人信息（保存在全局）
    userInfo: app.globalData.userInfo,
    //用户协议是否点击
    is_check_userAgreeMent: false,
    //新建的组织
    new_group: {
      //组织唯一码
      unique_code: '',
      //组织名称
      name: '',
      //组织介绍
      introduction: '',
      //创建时间
      createTime: '',
      //成员人数
      members_number: 1,
      //组织所在地址
      address: {
        province: '',
        city: '',
        district: '',
        community: '',
      },
      //组织创建者姓名
      founder_name: '',
      //组织官方联系电话
      phone_number: '',
      //组织内所有成员列表,内部存放成员openid和
      member_list: [],
    }
  },
  //构造最新时间函数(已格式化)
  getNowTime() {
    //构造时间标准格式
    var date = new Date
    //console.log('【date】',date)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    //console.log('【month】 ',month)
    month = (month / 10 < 1) ? '0' + month : month
    var day = date.getDate()
    day = (day / 10 < 1) ? '0' + day : day
    //console.log('【day】 ',day)
    var now_time = year + '.' + month + '.' + day
    console.log('【now_time】', now_time)
    return now_time
  },
  //创建UUID(基于随机数的UUID，可指定长度)
  create_uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
      i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
  //OnLoad函数
  onLoad(options) {
    var that = this
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  //OnShow函数
  onShow(){
    var that = this
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  //获取组织名称
  group_name(e) {
    //console.log(e)
    var name = e.detail.value
    this.setData({
      ['new_group.name']: name,
    })
  },
  //获取创建人姓名
  group_founder_name(e) {
    //console.log(e)
    var founder_name = e.detail.value
    this.setData({
      ['new_group.founder_name']: founder_name,
    })
  },
  //获取组织官方联系电话
  group_phone_number(e) {
    //console.log(e)
    var phone_number = e.detail.value
    this.setData({
      ['new_group.phone_number']: phone_number,
    })
  },
  //选择省市区
  choose_address(ch) {
    //console.log(ch)
    //获取省市区
    var province = ch.detail.value[0]
    var city = ch.detail.value[1]
    var district = ch.detail.value[2]
    console.log('用户选择的省市区：', province, ' ', city, ' ', district)
    this.setData({
      ['new_group.address.province']: province,
      ['new_group.address.city']: city,
      ['new_group.address.district']: district
    })
  },
  //获取组织所在的小区
  group_community(e) {
    var community = e.detail.value
    this.setData({
      ['new_group.address.community']: community,
    })
  },
  //获取组织简介
  group_introduction(e) {
    var introduction = e.detail.value
    this.setData({
      ['new_group.introduction']: introduction,
    })
  },
  //back函数
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //用户点击用户协议
  userAgreeMent(e) {
    console.log(e)
    var is_check_userAgreeMent = e.detail.value
    this.setData({
      is_check_userAgreeMent: is_check_userAgreeMent
    })
  },
  //重置所有信息
  reset() {
    console.log('【用户点击重置信息】')
    var empty_new_group = {
      //组织唯一码
      unique_code: '',
      //组织名称
      name: '',
      //组织介绍
      introduction: '',
      //创建时间
      createTime: '',
      //成员人数
      members_number: 1,
      //组织所在地址
      address: {
        province: '',
        city: '',
        district: '',
        community: '',
      },
      //组织创建者姓名
      founder_name: '',
      //组织官方联系电话
      phone_number: '',
      //组织内所有非管理员和成员列表,内部存放成员openid
      member_list: [],
    }
    //console.log(empty_new_group)
    var that = this
    this.setData({
      new_group: empty_new_group,
      is_check_userAgreeMent: false,
    })
    wx.showToast({
      title: '重置成功！',
      icon: 'success',
      duration: 500
    })
  },
  //提交创建组织信息
  async submit() {
    var that = this
    var new_group = that.data.new_group
    console.log(new_group)

    //检查各个信息是否填写完整
    if (new_group.name == '') {
      console.log('【组织名称未填写！】')
      wx.showToast({
        title: '请填写组织名称！',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (new_group.founder_name == '') {
      console.log('【组织创建人姓名未填写！】')
      wx.showToast({
        title: '请填写组织创建人姓名！',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (new_group.phone_number == '') {
      console.log('【组织官方联系电话未填写！】')
      wx.showToast({
        title: '请填写官方联系电话！',
        icon: 'none',
        duration: 1000
      })
      return
    } else if(new_group.phone_number.length!=11){
      console.log('【组织官方联系电话长度错误！】')
      wx.showToast({
        title: '官方联系电话长度不足11位！',
        icon: 'none',
        duration: 1000
      })
      return
    }else if (new_group.address.province == '') {
      console.log('【组织所在地址未填写！】')
      wx.showToast({
        title: '请填写组织所在地址！',
        icon: 'none',
        duration: 1000
      })
      return
    }else if(new_group.area==''){
      console.log('【组织所在小区未填写！】')
      wx.showToast({
        title: '请填写组织所在小区！',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (that.data.is_check_userAgreeMent == false) {
      console.log('【未勾选用户协议】')
      wx.showToast({
        title: '请勾选用户协议！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    //检查组织名称、创建者姓名、所在小区、简介否为空格组成的字符串
    if (new_group.name.match(/^[ ]+$/) || new_group.founder_name.match(/^[ ]+$/)|| new_group.address.community.match(/^[ ]+$/)) {
      console.log('填写内容不能由空格组成！')
      wx.showModal({
        title: '提示',
        content: '填写内容不能由空格组成!',
        showCancel: false,
        confirmColor: "#07c160",
      })
      return
    }
    /*检查个人信息是否填写完整，若没有，则引导其进行填写  start*/
    var userInfo=that.data.userInfo
    if (userInfo.address.building == "" || userInfo.address.no == "" || userInfo.address.room == "" ||userInfo.area==""|| userInfo.gender == "" || userInfo.real_name == "" || userInfo.phone_number == ""||userInfo.id_number=='') {
      wx.showModal({
        title: '提示',
        content: '请完善您的个人信息后再提交！',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //跳转到个人信息页面
            wx.navigateTo({
              url: '../personnalInfo/personalInfo',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    } 
    /*检查个人信息是否填写完整，若没有，则引导其进行填写  end*/

    //构造组织创建日期
    var createTime = this.getNowTime()
    console.log('组织创建日期：', createTime)
    new_group.createTime = createTime
    //构造组织唯一码(基于随机数的UUID,易于用户输入)
    var unique_code = that.create_uuid(8, 36)
    console.log('【创建的基于时间的UUID】', unique_code)
    new_group.unique_code = unique_code
    //将创建者的openid赋给创始人
    new_group.founder_openid=userInfo.openid
    //将创始人的openid和姓名放入成员列表
    var person={
      name:userInfo.real_name,
      openid:userInfo.openid,
      permission:3,
      phone_number:userInfo.phone_number
    }
    new_group.member_list.push(person)
    new_group.deal_number=0
    console.log('【新创建的组织信息：】', new_group)
    //上传数据库
    await db.collection('groups_table')
      .add({
        data: new_group,
        success: re => {
         console.log('【上传数据库组织表成功！】',re)
        },
        fail: re => {
          console.log('【新建组织上传数据库时发生错误！】', re)
          wx.showToast({
            title: '服务器发生异常错误，请重试！',
            icon: 'none',
            duration: 1000
          })
          return
        }
      })
    //将组织的部分信息放入到创始人的已加入组织列表中
    //构造组织信息
    var group={}
    group.permission='3'
    group.unique_code=unique_code
    group.name=new_group.name
    group.address=new_group.address
    console.log('【构造添加入user的组织数据】',group)
     await db.collection('user')
     .where({
       openid:userInfo.openid
     })
     .update({
        data:{
          joined_groups:_.push(group)
        },
        success:res=>{
          console.log('【数据库中更新user表成功！】',res)
        },
        fail:res=>{
          console.log('【数据库中更新user表失败！，请检查云数据库】',res)
        }
     })
    //将该组织唯一码更新到全局userInfo中的对应位置处
     app.globalData.userInfo.joined_groups.push(group)
     console.log('【更新全局userInfo成功！】',app.globalData.userInfo.joined_groups)
     //提示用户并延迟返回
     console.log('【新建组织成功！】')
     wx.showToast({
       title: '新建组织成功！',
       icon: 'success',
       mask: 'true',
       duration: 1000
     }).then(res=>{
       setTimeout(function(){
         wx.navigateBack({
           delta: 1,
         })
       },1000)
     })
  },

  jumpToTerms(){
    wx.navigateTo({
      url: '/pages/terms/terms',
    })
  },

  onShareAppMessage() {

  },
  
})