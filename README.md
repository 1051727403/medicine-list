# Medicine List

#### 名称
药清单（药单）微信小程序开发

功能结构图
![输入图片说明](images/%E5%8A%9F%E8%83%BD%E7%BB%93%E6%9E%84%E5%9B%BE(2).png)


## 更新日志 


### 2022-5-7 清单页面、药品页面、个人信息页面大体完成，修复若干bug，修复动画渲染问题，第一阶段任务大体完成，准备进入第二阶段搭建小区的配药清单管理平台   
  
### 2022-5-15 对UUID做了优化，清单UUID基于时间数实现，唯一性高，组织UUID基于字符串随机数实现，长度为8，基数为34.  
### 2022-5-17 设计优化了组织表，user表中新增joined_groups对象，存放该用户加入的组织的基本简单信息    
### 2022-5-18 更新了我管理的组织列表  
### 2022-5-19 更新了单个组织页面（未完成），优化部分UI.  
### 2022-5-27 更新了加入、退出、解散组织功能，更新并完善了分享功能  
后续完善清单提交（选择组织提交）功能以及小区管理员指定以及清单查看、审核、导出功能  
### 2022-5-28 修复了3个bug，提交功能实现，审核功能部分实现  
### 2022-5-29 实现清单的提交和审核功能， 
清单的状态会显示在右侧，同时设置提交后不能修改只可查看和分享清单，清单状态分为：无、待审核、已审核、审核未通过四种，同时优化ui设计，修复个人页面的跳转功能。后续实现任命管理员以及查看组织内清单并导出功能  
### 2022-5-30 实现成员管理板块  
创建者可对成员进行管理，包括：1、任命管理员 2、取消管理员权限 3、踢出成员  
### 2022-6-3 实现导出功能，同时修复完成清单用户删除BUG，改变数据库设计结构，新增当存在进行中的任务时，不可解散组织的功能
### 2022-6-11 修改组织信息功能实现,创始人可修改组织名称、组织电话号码、组织介绍
### 2022-6-15 修复BUG，优化体验，实现身份证验证
### 2022-6-16 新增代他人配药模式，现在不仅可以为自己配药，志愿者或家人还可远程为老年人代配药！
###  --
###  --
###  --
### 后续任务安排  
#### 1、查看清单进行排序 

### 目前存在的BUG：

  

