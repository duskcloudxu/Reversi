$(function () {
    var toggle = true;
    var count = 0;
    var username=Cookies.get("username");
    console.log(username);
    $("#user_name").text(username);
    if(username===undefined){
        swal({
            type:"error",
            text:"你还没有登录",
        }).then(()=>{
            window.location="/";
        })
    }
    $(window).keypress((e) => {//监听回车
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            $("#send").click();
        }
    });
    $("img.img_left").click(function () {
        if (toggle && $(this).attr("title") == "0") {
            $(this).attr("src", "../img/test.jpg");
            toggle = false;
            $(this).attr("title", "1");
        } else if (!toggle && $(this).attr("title") == "1") {
            $(this).attr("src", "../img/u34.png");
            toggle = true;
            $(this).attr("title", "0");
        }
    });
    $("img.img_right").click(function () {
        if (toggle && $(this).attr("title") == "0") {
            $(this).attr("src", "../img/test.jpg");
            toggle = false;
            $(this).attr("title", "1");
        } else if (!toggle && $(this).attr("title") == "1") {
            $(this).attr("src", "../img/u34.png");
            toggle = true;
            $(this).attr("title", "0");
        }
    });
    $("img.img_right").mouseover(function () {
        $(this).css("opacity", "0.5");
    });
    $("img.img_right").mouseout(function () {
        $(this).css("opacity", "1");
    });
    $("img.img_left").mouseover(function () {
        $(this).css("opacity", "0.5");
    });
    $("img.img_left").mouseout(function () {
        $(this).css("opacity", "1");
    });
    $("#send").click(function () {
        //定义空字符串
        var str = "";
        if ($("#msg").val() == "") {
            // 消息为空时弹窗
            alert("消息不能为空");
            return;
        }
        else{
            str = '<div class="talk_name"><span>'+username+':'+'</span></div>'+'<div class="atalk"><span>'+ $("#msg").val() +'</span></div>' ;
        }

        $("#display_msg").html($("#display_msg").html() + str);
        $("#msg").val("");

    });
});
