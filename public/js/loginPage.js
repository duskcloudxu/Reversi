$(document).ready(() => {
    let isTyping = true;

    function listenToEnter() {
        $(window).keypress((e) => {//监听回车
            console.log(e.keyCode);
            if (e.keyCode === 13 && isTyping) {
                $("#login").click();
            }
        });
    }

    listenToEnter();
    $("#login").click((e) => {
        let username = $("#username_input").val();
        let password = $("#pass_input").val();
        console.log([username, password]);
        $.ajax({
            url: 'http://localhost:3000/test/login',
            data: {
                username: username,
                password: password,
            },
            type: 'get',
            success: (data) => {
                isTyping = false;
                if (data === "登陆成功") {
                    swal({
                        title: '登陆成功',
                        type: 'success',
                        confirmButtonText: '进入大厅'
                    }).then((res)=>{
                        isTyping = true;
                        window.location = "lobby";
                        Cookies.set("username",username);
                    });
                }
                else {
                    swal({
                        title: '错误',
                        text: data,
                        type: 'error',
                        confirmButtonText: '再次输入'
                    }).then((res)=>{
                        isTyping = true;
                    });
                }

            },
            fail: (data) => {
                alert(data)
            }
        })
    });
});