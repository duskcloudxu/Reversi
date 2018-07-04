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
- 注册字符检查
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