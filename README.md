#黑白棋
>TODO:应用图标
>TODO:协力者表格


介绍：这是一个基于SOCKETIO实现的多人黑白棋网络对战游戏。

##使用说明
下载完成后运行在cmd中运行一下代码来安装依赖
```
npm install
```
##编辑说明
登陆界面为：
```
http://localhost:3000/
```
大厅界面为：
```
http://localhost:3000/lobby
```
游戏界面为：
```
http://localhost:3000/game
```
目前进度为这三者的前端页面编辑以及后面的逻辑实现。
具体bootstrap,Jquery的使用案例请参考test.hbs这个模板

（但是javascript记得分到public下的文件夹对每个页面单独写一个）
##TODOLIST:
- jquery 双向绑定
- 密码加密存储
- 注册字符检查[halfSolved: 没有加提示语与请求，但是加了限制。]
- 用正则优化注册检查
- 增加上传头像功能
##感想
- mongoose的数据库链接真的是贴心到气人：
```
model = mongoose.model('user', users);
```
连接到的是名为"users"的表
```
model = mongoose.model('users', users);
```
连接到的是名为"users"的表
```
model = mongoose.model('userssss', users);
```
连接到的是名为"usersssses"的表

我真的是 谢谢你啊。

##代码审查：
- 发现bug若干
- 发现ID和需求对不上号若干
- 发现less文件写的过于繁琐
- 发现变量定义不明

解决方案：
    
  为了帮助某些人养成良好的代码习惯，又考虑到现在socketIO正在卡壳，前端的工作基本完成，现要求：
  - 使用Less的嵌套方法重新优化样式表文件
  - 使用小驼峰命名法重新书写变量
  - 使用bootstrap优化原页面，取出不必要的ID绑定和DOM结构。
    