#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('blackandwhite:server');
var http = require('http');
var socket = require('socket.io');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

//socketIO链接
var io = socket(server);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
var roomList = new Map;
var user2socket = new Map;
var socket2user = new Map;
var user2user = new Map;
var user2pos = new Map;

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function init() {
  for (var i = 0; i < 4; i++) {
    roomList[i] = {
      userList: [null, null],
      checkList: [false, false]
    }
  }
}

init();
io.on('connection', (socket) => {
  console.log("A member connected");
  socket.emit("roomListUpdate", roomList);
  socket.on("disconnect", () => {
    console.log("A member disconnected");
    if (socket.request.headers.referer === "http://localhost:3000/lobby") {
      var username = socket2user[socket.id];
      var pos = user2pos[username];
      console.log(username, pos);
      if (pos !== null) {
        roomList[pos.tableNum].userList[pos.seatNum] = null;
        roomList[pos.tableNum].checkList[pos.seatNum] = false;
      }
      socket.broadcast.emit("roomListUpdate", roomList);
    }
    if (socket.request.headers.referer === "http://localhost:3000/game"){
      var username = socket2user[socket.id];
      var oppoName=user2user[username];
      user2user[username]="%quited";
      var oppoSocket=user2socket[oppoName];
      console.log(username,oppoName,oppoSocket);
      oppoSocket.emit("resign");
    }
  });
  socket.on('chatMessage', (msg) => {
    console.log(msg);
    socket.emit('chatMessageClient', msg);
    socket.broadcast.emit('chatMessageClient', msg);
  });
  socket.on("seated", (msg) => {
    roomList[msg.tableNum].userList[msg.seatNum] = msg.username;
    console.log(roomList);
    socket.emit("roomListUpdate", roomList);
    socket.broadcast.emit("roomListUpdate", roomList);
    user2socket[msg.username] = socket;
    socket2user[socket.id] = msg.username;
    user2pos[msg.username] = {
      tableNum: msg.tableNum,
      seatNum: msg.seatNum,
    }
  });
  socket.on("leave", (msg) => {
    user2pos[msg.username] = null;
    roomList[msg.tableNum].userList[msg.seatNum] = null;
    roomList[msg.tableNum].checkList[msg.seatNum] = false;
    console.log(roomList);
    socket.emit("roomListUpdate", roomList);
    socket.broadcast.emit("roomListUpdate", roomList);
  });
  socket.on("ready", (msg) => {
    roomList[msg.tableNum].checkList[msg.seatNum] = true;
    socket.emit("roomListUpdate", roomList);
    socket.broadcast.emit("roomListUpdate", roomList);
    console.log(roomList);
    var oppo = msg.seatNum === 1 ? 0 : 1;//确定对方是否准备完成
    if (roomList[msg.tableNum].checkList[oppo]) {
      var oppoName = roomList[msg.tableNum].userList[oppo];
      var oppoSocket = user2socket[oppoName];
      var mySocket = user2socket[msg.username];
      console.log(oppoSocket);

      var random = parseInt(Math.random() * 10) % 2;
      oppoSocket.emit("gameStart", random);
      mySocket.emit("gameStart", random === 1 ? 0 : 1);

      user2user[oppoName] = msg.username;
      user2user[msg.username] = oppoName;
    }
  });
  socket.on("socketUpdate", (username) => {
    console.log(username);
    user2socket[username] = socket;
    socket2user[socket.id] = username;
  });
  socket.on("move", (msg) => {
    var username = msg.username;
    var index = msg.index;
    var targetSocket = user2socket[user2user[username]];
    console.log(targetSocket);
    targetSocket.emit("move", index);
  })
  socket.on("resign", (username) => {
    console.log(username + " resigned");
    var targetSocket = user2socket[user2user[username]];
    targetSocket.emit("resign");
  })
});

