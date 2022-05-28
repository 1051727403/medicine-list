# Medicine List

#### 名称
药清单（药单）微信小程序开发
## 更新日志 

### 2022-5-2 更新内容：新建码云仓库，将代码上传到仓库  
### 2022-5-3 扫码api秘钥信息如下:  
app_id:hvhmohepuqlrinmo  
app_secret:TCtyRTduSjZNUGhHaGl3K3R5ejhHUT09  
### 2022-5-7 清单页面、药品页面、个人信息页面大体完成，修复若干bug，修复动画渲染问题，第一阶段任务大体完成，准备进入第二阶段搭建小区的配药清单管理平台，进行数据库、需求文档的设计以及页面UI的设计等  
  
### 2022-5-15 对UUID做了优化，清单UUID基于时间数实现，唯一性高，组织UUID基于字符串随机数实现，长度为8，基数为34.  
###           实现用户创建组织的功能
### 2022-5-17 设计优化了组织表，user表中新增joined_groups对象，存放该用户加入的组织的基本简单信息  
### 2022-5-18 更新了我管理的组织列表
### 2022-5-19 更新了单个组织页面（未完成），优化部分UI.
### 2022-5-27 更新了加入、退出、解散组织功能，后续完善清单提交（选择组织提交）功能以及小区管理员指定以及清单查看、审核、导出功能
###           更新并完善了分享功能
### 2022-5-28 修复了3个bug（创建组织时组织信息若为空，需要特判、个人信息的居住地址应为必填、药品初始化数量为1），提交功能实现，审核功能部分实现  
###  
###  
###  
### 后续任务安排  
#### 1、提交功能：能够选择加入的组织进行提交，包括管理的组织  （5月31日前完成）  
#### 2、审核功能：组织内有审核入口，可以审核所有已提交但未通过审核的订单，同时改变清单状态  （5月31日前完成）
#### 3、查看功能：组织内有查看&导出入口，管理员或创建者能够查看上传的所有清单，并对上传待审核、审核完成待完成、已完成的三类清单进行分类展示查看（6月3日前完成）
#### 4、导出功能：组织内有查看&导出入口，可以分类导出查看的三种类型的清单为excel格式的文本（6月3日前完成）
### 其余小功能：  
#### 1、组织能够对已审核的清单改变其状态为已完成  
#### 2、将组织唯一识别码构建成二维码的形式，能够进行分享  
#### 3、用户能够撤回已提交但未通过审核的清单  
#### 4、创始人能够修改小区部分公开信息

### 目前存在的BUG：
1、解散组织时可能user表中未成功移除相关数据   
2、解散组织时，若有未完成的清单，则不可以解散  
3、填写用户个人信息时需要让其勾选隐私保护协议   
  
  
  
### -----  
  
   
  
  
## 几个常用网址  
1、码云git仓库：https://gitee.com/the-falling-of-a-meteoroid/medicine-list  
2、阿里巴巴图标库：https://www.iconfont.cn/search/index?searchType=icon&  q=%E5%87%8F%E5%B0%91&page=1&tag=&fromCollection=-1&fills=    
3、CSND用来存放静态图片：https://blog.csdn.net/qq_51413628/article/details/124077214?csdn_share_tail=%7B%22type%22%3A%22blog%22%2C%22rType%22%3A%22article%22%2C%22rId%22%3A%22124077214%22%2C%22source%22%3A%22qq_51413628%22%7D&ctrtid=ns10W  
4、配色网站：https://uigradients.com/#Tranquil  
5、墨刀（用于制作原型）：https://modao.cc/embed/auth_box?type=signin&next=%2Fapp%2Fdesign%2Fpbkvykpy9n70bjam  
6、近义词小程序云开发实战视频（没接触过小程序的话用于初始学习）：https://www.xuetangx.com/course/THU0809003580111/5824963?channel=i.area.learn_title  
7、脑图、流程图制作工具processOn：https://www.processon.com/diagrams  
8、微信官方api文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/capabilities.html#%E6%95%B0%E6%8D%AE%E5%BA%93  
8、flex弹性布局博客：https://www.cnblogs.com/hellocd/p/10443237.html  
9、菜鸟驿站、W3school等学习css、js的网站  
10、微信小程序开发大赛规则：https://developers.weixin.qq.com/community/competition/intro  
11、https://mp.weixin.qq.com/wxamp/home/guide?lang=zh_CN&token=1535826188  

