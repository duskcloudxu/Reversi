$(function () {
    /**
     * 全局变量初始化
     *
     */
    var toggle = true;
    var count = 0;
    var username = Cookies.get("username");
    var socket = io();

    /**
     * 登陆模块
     */
    $("#user_name").text(username);
    //检测用户是否通过直接访问URL的方式进入大厅
    if (username === undefined) {
        swal({
            type: "error",
            text: "你还没有登录",
        }).then(() => {
            window.location = "/";
        })
    }

    /**
     * 大厅功能模块
     */
    /*
    在进入的时候更新socket
     */
    socket.emit("socketUpdate",username);

    //点击按钮事件绑定
    $(".img_seat").click(function (e) {
        if (toggle && $(this).attr("title") == "0" && $(this).attr("seated") == "0") {
            $(this).attr("src", "../img/test.jpg");
            toggle = false;
            $(this).attr("title", "1");
            $(e.target).parent().find('.btnGroup').css("visibility", "visible");
            var currentTable = $(e.target).parents(".desk").index();//parents返回其DOM树的根路径上的所有元素，并由选择器筛选
            var currentSeat = $(e.target).parents(".seat").index();
            var msg = {
                tableNum: currentTable,
                seatNum: currentSeat === 0 ? 0 : 1,
                username: username,
                checked: false
            };
            socket.emit("seated", msg);
        }
    });


    //离开按钮事件绑定
    $('.leave').click((e) => {
        var img = $(e.target).parent().parent().find("img");
        if (!toggle && $(img).attr("title") === "1") {
            $(img).attr("src", "../img/u34.png");
            toggle = true;
            $(img).attr("title", "0");
            $(e.target).parent().css("visibility", "hidden");
            var currentTable = $(e.target).parents(".desk").index();//parents返回其DOM树的根路径上的所有元素，并由选择器筛选
            var currentSeat = $(e.target).parents(".seat").index();
            console.log(currentTable, currentSeat);
            var msg = {
                tableNum: currentTable,
                seatNum: currentSeat === 0 ? 0 : 1,
                username: username,
            };
            socket.emit("leave", msg)
        }
    });

    //准备按钮事件绑定
    $(".ready").click((e) => {
        var currentClass = $(e.target).attr("class");
        //使用此时按钮的class状态判断准备状态
        var currentTable = $(e.target).parents(".desk").index();//parents返回其DOM树的根路径上的所有元素，并由选择器筛选
        var currentSeat = $(e.target).parents(".seat").index();
        var msg = {
            tableNum: currentTable,
            seatNum: currentSeat === 0 ? 0 : 1,
            username: username,
        };
        if (currentClass === "btn btn-success ready") {
            $(e.target).attr("class", "btn btn-secondary ready");
            socket.emit("ready", msg);
        }
        else {
            $(e.target).attr("class", "btn btn-success ready");
            socket.emit("cancelReady", msg);
        }

    });
    /*
     大厅状态更新
     */
    socket.on("roomListUpdate", (roomList) => {
        var deskList = $(".desk");
        for (var i = 0; i < deskList.length; i++) {
            var currentDesk = $(deskList[i]);
            if (roomList[i].userList[0] !== null) {//进入时绑定图片，退出时取消图片
                $(currentDesk).find(".img_left").attr("src", "../img/test.jpg");
                $(currentDesk).find(".img_left").attr("seated","1");

            }
            else {
                $(currentDesk).find(".img_left").attr("src", "../img/u34.png");
                $(currentDesk).find(".img_left").attr("seated","0");

            }
            if (roomList[i].userList[1] !== null) {
                $(currentDesk).find(".img_right").attr("src", "../img/test.jpg");
                $(currentDesk).find(".img_right").attr("seated","1");

            }
            else {
                $(currentDesk).find(".img_right").attr("src", "../img/u34.png");
                $(currentDesk).find(".img_right").attr("seated","0");
            }
        }
    });
    /*
     游戏开始
     */
    socket.on("gameStart", (msg) => {
        console.log(msg);
        Cookies.set("myMove", msg);
        window.location = "game";
    });

    /**
     * 聊天室函数
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

    /*
     send按钮事件绑定
     */
    $("#send").click(function () {
        //定义空字符串
        var content = $("#msg").val();
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
        $("#msg").val("");
    });
    /*
     io链接接收
     */
    socket.on("chatMessageClient", (msg) => {
        console.log(msg);
        var str = '<div class="talk_name"><span>' + msg.username + ':' + '</span></div>' + '<div class="atalk"><span>' + msg.content + '</span></div>';
        $("#display_msg").html($("#display_msg").html() + str);
        $("#display_msg").scrollTop($("#display_msg").height());
    })


    /**
     * 镜像聊天室（就改了人名-消息模块的text-align）
     */
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
            socket.emit('privateChat', msg);

        }
        $("#msg_m").val("");
    });

    socket.on("privateChat", (msg) => {
        console.log(msg);
        var str = '<div class="talk_name"><span>' + msg.username  + '</span></div>' + '<div class="atalk"><span>' + msg.content + '</span></div>';
        $("#display_msg_m").html($("#display_msg_m").html() + str);
        $("#display_msg_m").scrollTop($("#display_msg_m").height());
    })

});
