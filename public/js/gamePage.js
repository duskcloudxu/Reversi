var playerColor;//玩家棋子颜色
var runningFlag = false;
var dir_x = [1, 1, 0, 0, 1, -1, -1, -1];
var dir_y = [1, -1, 1, -1, 0, 0, -1, 1];
var m = [];
var flag = 0;
//white: 1
//black: -1
//none: 0
/**
 * 全局变量初始化
 */
var t;
var username = Cookies.get("username");
var socket = io();
var myMove = Cookies.get("myMove");//服务器随机出的先攻，1代表黑棋，0代表白棋
var end;
var sec = 30;

socket.emit("socketUpdate", username);
playerColor = -1;
myMove === "1" ? myMove = -1 : myMove = 1;
$("#user_name").text(username);

/**
 * 初始化
 */
swal({
    title: "执白执黑",
    text: "您是" + (myMove === -1 ? "黑棋" : "白棋"),
}).then(() => {
    PickColor(myMove);
    countDown();
});

/**
 * socket.io模块
 */
/*
 下棋接收
 */
socket.on("move", (index) => {
    console.log(1);
    Move(index, myMove === -1 ? 1 : -1);
    playerColor *= -1;
    ShowHint();
    sec = 30;
});
/*
 认输接收
 */
socket.on("resign", () => {
    swal({
        text: "对方已认输"
    }).then(() => {
        window.location = "lobby";
    })
});
/*
 异常接收
 */
socket.on("abort", () => {
    swal({
        text: "对局异常，即将返回大厅"
    }).then(() => {
        window.location = "lobby";
    })
});


/**
 *ready按钮点击事件
 */
$("#ready").click(function () {
    PickColor(-1);
    $("#choose_color").fadeOut();
    countDown();
});

/**
 *grid网格数组点击事件
 */
function ClickGrid(_this) {
    if (!runningFlag) return;
    if (m[_this.index] !== 0) return;
    if (!Attack(_this.index, playerColor).length) return;
    if (myMove !== playerColor) return;
    Move(_this.index, playerColor);
    var p = PossiblePlace(playerColor * -1);
    if (!p.length) {
        ShowNum();
        ShowHint();
    }
    //setTimeout("AI_1("+playerColor * -1+")", 1000);
    playerColor = playerColor * -1;
    if (p.length === 0) {
        playerColor = playerColor * -1;
        ShowHint();
    }
    var msg = {
        username: username,
        index: _this.index,
    };
    socket.emit("move", msg);

}

/**
 *显示合法落子位置
 */
function ShowHint() {
    var p = PossiblePlace(playerColor);
    for (var i = 0; i < 64; ++i) {
        $('.grids')[i].style.backgroundColor = 'green';
    }
    for (var i = 0; i < p.length; ++i) {
        $('.grids')[p[i]].style.backgroundColor = 'rgb(0, 40, 0)';
    }
    whosturn();
}

/**
 *初始化
 */
function Init() {
    sec = 30;
    time.innerHTML = sec;
    for (var i = 0; i < 64; ++i) {
        Display(i, 0);
        $('.grids')[i].index = i;
        m[i] = 0;
    }
    Display(27, 1);
    Display(28, -1);
    Display(35, -1);
    Display(36, 1);
    m[27] = 1;
    m[28] = -1;
    m[35] = -1;
    m[36] = 1;
    $("#choose_color").fadeIn();
    runningFlag = false;
    for (var i = 0; i < 64; ++i)
        $('.grids')[i].style.backgroundColor = 'green';
    ShowNum();

    clearTimeout(t);
}

/**
 * 根据传入的颜色参数选颜色
 * @param _c 颜色参数
 * @constructor
 */
function PickColor(_c) {

    $('#c_black').css("color", "yellow");
    $('#c_white').css("color", "black");
    ShowHint();
    //setTimeout("AI_1("+playerColor * -1+")", 1000);

    runningFlag = true;
}

/**
 * 显示棋子
 * @param _index 网格位置
 * @param _color 颜色参数
 * @constructor
 */
function Display(_index, _color) {
    if (_color == 0) {
        $('#b' + _index).fadeOut(0);
        $('#w' + _index).fadeOut(0);
        return;
    }
    var tag = "#" + (_color == 1 ? 'w' : 'b') + _index;
    var not_tag = "#" + (_color == -1 ? 'w' : 'b') + _index;
    $(not_tag).fadeOut(0);
    $(tag).fadeIn('slow');
}

$(document).ready(function () {
    sec = 30
    Init();

});

/**
 * 根据落子位置生成变色棋子的位置信息
 * @param _index 位置参数
 * @param _c 颜色参数
 * @returns {Array} 落子之后变色的每一个位置
 * @constructor
 */
function Attack(_index, _c) {
    var attack = [];
    var x = _index >> 3;
    var y = _index % 8;
    if (m[_index] != 0) return attack;
    for (var j = 0; j < 8; ++j) {
        var nx = x + dir_x[j];
        var ny = y + dir_y[j];
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (m[(nx << 3) + ny] == (_c * -1)) {
                var tx = nx, ty = ny;
                var ta = [(nx << 3) + ny];
                var tf = false;
                for (; ;) {
                    tx += dir_x[j], ty += dir_y[j];
                    if (tx >= 0 && tx < 8 && ty >= 0 && ty < 8) {
                        if (m[(tx << 3) + ty] == _c) {
                            tf = true;
                            break;
                        }
                        if (m[(tx << 3) + ty] == 0) break;
                        ta.push((tx << 3) + ty);
                    }
                    else break;
                }
                if (tf) attack = attack.concat(ta);
            }
        }
    }
    return attack;
}

/**
 * 生成黑或白棋的合法落子位置数组
 * @param _c 颜色参数
 * @returns {Array} 合法落子位置数组
 * @constructor
 */
function PossiblePlace(_c) {
    var p = [];
    for (var i = 0; i < 64; ++i) {
        var a = Attack(i, _c);
        if (a.length) p.push(i);
    }
    return p;
}


/**
 * 更新棋子数并返回优势
 * @returns {number} 黑子或白子优势
 * @constructor
 */
function ShowNum() {
    var wn = 0, bn = 0;
    for (var i = 0; i < 64; ++i) {
        if (m[i] == -1) ++bn;
        if (m[i] == 1) ++wn;
    }
    $('#c_white')[0].innerText = bn;
    $('#c_black')[0].innerText = wn;
    whosturn();
    if (bn > wn) return -1;
    if (bn === wn) return 0;
    if (bn < wn) return 1;
}

/**
 * 谁的回合
 */
function whosturn() {
    if (playerColor == 1) {
        $('#c_black').css("color", "yellow");
        $('#c_white').css("color", "black");
    }
    if (playerColor == -1) {
        $('#c_white').css("color", "yellow");
        $('#c_black').css("color", "black");
    }

}


/**
 * 根据落子位置和颜色引用各个函数来得到最终结果
 * @param _index 落子位置
 * @param _c 棋子颜色
 * @constructor
 */
function Move(_index, _c) {
    var a = Attack(_index, _c);
    if (!a.length) return;
    m[_index] = _c;
    Display(_index, _c);
    for (var i = 0; i < a.length; ++i) {
        m[a[i]] = _c;
        Display(a[i], _c);
    }
    ShowNum();
    end = IsEnd();
    for (var i = 0; i < 64; ++i)
        $('.grids')[i].style.backgroundColor = 'green';
    if (end) {
        runningFlag = false;
        if (ShowNum() == 0) {
            swal({
                text: "平局！"
            }).then(() => {
                window.location = "lobby";
            })
        }
        if (ShowNum() == myMove) {
            swal({
                text: "你赢了！"
            }).then(() => {
                window.location = "lobby";
            })
        }
        if (ShowNum() == -1 * myMove) {
            swal({
                text: "你输了！"
            }).then(() => {
                window.location = "lobby";
            })
        }
    }
}

/**
 * 投降按钮事件
 */
function res() {
    swal({
        text: "你输了！"
    }).then(() => {
        socket.emit("resign", username);
        window.location = "lobby";
    })
}

$("#headico").click(function () {
    $('#change').modal('show');
});
// function AI_1(_c)
// {
//     var p = PossiblePlace(_c);
//     if (p.length == 0) return false;
//     var r = Math.floor(Math.random()*100) % p.length;
//     Move(p[r], _c);
//     ShowHint();
//     var p = PossiblePlace(_c*-1);
//     if (!p.length){
//         setTimeout("AI_1("+_c+")", 1000);
//     }
//     return true;
// }
/**
 * 判断棋局是否结束并返回判断结果
 * @returns {boolean}
 * @constructor
 */
function IsEnd() {
    var pb = PossiblePlace(-1);
    var pw = PossiblePlace(1);
    if (!pb.length && !pw.length) {
        return true;
    }
    return false;

}


/**
 * 倒数计时
 */
function countDown() {
    if (sec > 0) {
        time.innerHTML = sec--;
    } else {
        playerColor = playerColor * -1;//轮换
        ShowHint();
        sec = 30;//设置倒计时时间为30秒
    }
    t = setTimeout('countDown()', 1000);
}

/**
 * 聊天室
 */
/**
 * 镜像聊天室（就改了人名-消息模块的text-align）
 */
/*
 回车监听
 */
$(window).keypress((e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
        $("#send_m").click();
    }
});

$("#send_m").click(function () {
    //定义空字符串
    var content = $("#msg_m").val();
    if (content == "") {
        // 消息为空时弹窗
        alert("消息不能为空");
        return;
    }
    else {
        var msg = {
            username: username,
            content: content
        };
        socket.emit('chatMessage', msg);

    }
    $("#msg_m").val("");
});

socket.on("chatMessageClient", (msg) => {
    console.log(msg);
    var str = '<div class="talk_name"><span>' + msg.username  + '</span></div>' + '<div class="atalk"><span>' + msg.content + '</span></div>';
    $("#display_msg_m").html($("#display_msg_m").html() + str);
    $("#display_msg_m").scrollTop($("#display_msg_m").height());
})






