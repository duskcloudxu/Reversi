#黑白棋


![socket.io](https://img.shields.io/badge/socket.io-2.1.1-yellowgreen.svg)
![socket.io](https://img.shields.io/badge/express-4.16.0-blue.svg)
![socket.io](https://img.shields.io/badge/sweetalert2-7.24.4-red.svg)
![socket.io](https://img.shields.io/badge/jquery-3.3.1-red.svg)
![socket.io](https://img.shields.io/badge/Bootstrap-4.1.1-8627cc.svg)
![socket.io](https://img.shields.io/badge/nodeJS-8.11.1-32ca55.svg)

| 协力者                                        | 模块                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| [lvjingzhi](https://github.com/lvjingzhi)     | 前端页面编写，UI设计，黑白棋模块编写                         |
| [duskcloudxu](https://github.com/duskcloudxu) | 框架搭建，数据库连接，socketio连接，后台逻辑编写，前台和后台逻辑有关的接口编写 |

介绍：这是一个基于socket.io实现的多人黑白棋网络对战游戏。



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
- 增加上传头像功能 [实现js文件路径为: public/lib/cropperClipping/clippingTool.js]
- 路由规范
- 前端离开当前网页的提示
- 图片上传
##感想
###mongoose的数据库链接真的是贴心到气人：
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
### socket.io的感想
- 对于一个特定客户端的特定标志引发的on监听事件，若在该事件作用域内进行任何标志的emit，则只有发送信息的客户端的相关标志监听事件能够收到，这样说可能很绕口，让我们来看看样例：

服务器端：
```javascript
io.on('connection', (socket) => {
  console.log("A member connected");
  socket.on("disconnect", () => {
    console.log("A member disconnected");
  });
  socket.on('chatMessage', (msg) => {
    console.log(msg);
    // socket.emit('chatMessageClient',msg);
    socket.broadcast.emit('chatMessageClient',msg);
  })
});
```
客户端：
```javascript
socket = io();
$("#send").click(() => {
  	console.log($("#chatMessage").val());
 	socket.emit('chatMessage', $("#chatMessage").val());
});
  socket.on("chatMessageClient", (msg) => {
  	console.log(msg);
 	$('#chatBoard').append($('<li>').text(msg));
})
```
代码如上，重点在
```javascript
socket.on('chatMessage', (msg) => {
    console.log(msg);
    // socket.emit('chatMessageClient',msg);
    socket.broadcast.emit('chatMessageClient',msg);
  })
```
这里，如果我们用的是被注释的那一行，那么只有触发这个标志的客户端，就叫A好了，客户端A才会通过代码的

```javascript
 socket.on("chatMessageClient", (msg) => {
  	console.log(msg);
 	$('#chatBoard').append($('<li>').text(msg));
})
```

收到emit中的msg内容，而

```javascript
socket.broadcast.emit('chatMessageClient',msg);
```

恰恰相反，它会让所有非A的连接到客户端的机器收到msg。

- socket的刷新

  socket对象会在页面进行刷新或者转换的时候掉线，然后转换到game界面的时候调用了原来user2socket对应的socket链接，然后就悲剧的debug了半个小时……


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

## 和需求不一样的地方

经过考虑，打算将原定的：由服务器完成全部计算 改成 服务器记录初始状态，在每一步进行验证，若验证不成功，则返回错误，并自动将该局判负。 

目前先实现对用户返回数据绝对信任的模型，因为黑白棋模块缺乏实际可用的API,没有很好的做到模块化，这个下次要注意。

## 游戏的具体实现

先通过用户登录来取得当前用户的名称，放在cache里面（事实上这一步可以做一个服务器返回秘钥，但是先把主体搭好再说），通过取得cache知道当前用户名，通过当前用户名来实现聊天室功能，通过当前用户名维护roomList,即前端通过socketio在roomList有更新的时候更新前端画面，然后当用户点击前端对应的座位的时候更新后端信息。

当两个座位上都坐满了以后，双方在都点击了准备的情况下会跳转进对局页面。（在roomList里面的数据里加一个ready项）综上所述，roomList的格式应该为：

roomList={

​	{

​		player:["MrWhite","MrBlack"],

​		checked:[true,false]//代表第一个玩家准备好了，第二个玩家没有准备好。

​	}

}

## 可以改进的部分

socket建立的不同标志的链接实在是有点多，这个结构个人觉得存在优化的可能性。