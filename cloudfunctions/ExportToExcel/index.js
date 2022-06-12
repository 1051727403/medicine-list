const cloud = require('wx-server-sdk')
cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const xlsx = require('node-xlsx') //导入Excel类库
const db = cloud.database() //声明数据库对象
const _ = db.command
exports.main = async (event, context) => { //主函数入口
  try {
    //声明一个Excel表，表的名字用随机数产生
    let alldata = [];
    var id = event.id
    var medicines
    var name
    await db.collection('list_table').where({
      id: id
    }).get().then(res => {
      medicines = res.data[0].medicines
      name = res.data[0].name
    })
    console.log(medicines)
    var user_name
    await db.collection('checked_medicine_list_table').where({
      id: id
    }).get().then(res => {
      user_name = res.data[0].user_name
    })
    let namerow = ['姓名', '身份证号', '居住地址', '联系电话']
    alldata.push(namerow)
    var address
    var id_number
    var phone_number
    await db.collection('user').where({
      real_name: user_name
    }).get().then(res => {
      console.log(res.data)
      address = res.data[0].address
      id_number = res.data[0].id_number
      phone_number = res.data[0].phone_number
    })
    console.log(address)
    let membername = [user_name, id_number, address.area + address.building + '号' + address.no + '号楼' + address.room + '室', phone_number]
    alldata.push(membername);
    let dataCVS = `medicines-${Math.floor(Math.random()*1000000000)}.xlsx`
    let row = ['药品名称', '药品规格', '药品品牌', '数量']; //表格的属性，也就是表头说明对象
    alldata.push(row); //将此行数据添加到一个向表格中存数据的数组中
    //接下来是通过循环将数据存到向表格中存数据的数组中
    for (let key = 0; key < medicines.length; key++) {
      let arr = [];
      arr.push(medicines[key].name);
      arr.push(medicines[key].specification);
      arr.push(medicines[key].brand);
      arr.push(medicines[key].number);
      alldata.push(arr)
    }
    var buffer = xlsx.build([{
      name: name,
      data: alldata
    }]);
    //将表格存入到存储库中并返回文件ID
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })
  } catch (error) {
    console.error(error)
  }
}