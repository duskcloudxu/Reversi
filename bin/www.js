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
    socket.emit("roomListUpdate",roomList);
    socket.on("disconnect", () => {
        console.log("A member disconnected");
    });
    socket.on('chatMessage', (msg) => {
        console.log(msg);
        socket.emit('chatMessageClient', msg);
        socket.broadcast.emit('chatMessageClient', msg);
    });
    socket.on("seated", (msg) => {
        roomList[msg.tableNum].userList[msg.seatNum] = msg.username;
        console.log(roomList);
        socket.emit("roomListUpdate",roomList);
        socket.broadcast.emit("roomListUpdate",roomList);
    });
    socket.on("leave", (msg) => {
        roomList[msg.tableNum].userList[msg.seatNum] = null;
        console.log(roomList);
        socket.emit("roomListUpdate",roomList);
        socket.broadcast.emit("roomListUpdate",roomList);
    })
    socket.on("ready",(msg)=>{
        roomList[msg.tableNum].checkList[msg.seatNum] = true;
        socket.emit("roomListUpdate",roomList);
        socket.broadcast.emit("roomListUpdate",roomList);
        var oppo=msg.seatNum===1?0:1;//确定对方是否准备完成
        if(roomList[msg.tableNum].checkList[oppo]){

        }
    })
});

