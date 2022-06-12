const cloud = require('wx-server-sdk')
cloud.init({
  env: 'medicine-list-0gpcpvk471c437e4',
})
const xlsx = require('node-xlsx') //导入Excel类库
const db = cloud.database() //声明数据库对象
const _ = db.command
exports.main = async (event, context) => { //主函数入口
  try {
    var unique_code = event.unique_code
    var checked_medicine_list
    var medicines
    var name
    await db.collection('checked_medicine_list_table').where({
      unique_code: unique_code
    }).get().then(res => {
      checked_medicine_list = res.data
    })
    console.log(checked_medicine_list)
    let dataCVS = `medicines-${Math.floor(Math.random()*1000000000)}.xlsx`
    //声明一个Excel表，表的名字用随机数产生
    let alldata = [];
    for (let i in checked_medicine_list) {
      let namerow = ['姓名']
      alldata.push(namerow)
      let membername = [checked_medicine_list[i].user_name]
      alldata.push(membername);
      await db.collection('list_table').where({
        id: checked_medicine_list[i].id
      }).get().then(res => {
        medicines = res.data[0].medicines
        name = res.data[0].name
      })
      console.log(medicines)
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