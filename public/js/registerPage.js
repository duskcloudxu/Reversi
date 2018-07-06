$(document).ready(() => {
    let isTyping = true;

    function listenToEnter() {
        $(window).keypress((e) => {//监听回车
            console.log(e.keyCode);
            if (e.keyCode === 13 && isTyping) {
                $("#register").click();
            }
        });
    }
    listenToEnter();

    $("#register").click((e) => {
        isTyping = false;
        let username = $("#username_input_reg").val();
        let password = $("#pass_input_reg").val();
        let confirmPassword = $("#pass_input_cf").val();
        var regn=/^[a-zA-Z][a-zA-Z0-9]{4,9}$/;
        //检测输入内容是否匹配正则表达式
        if(!regn.test(username)){
            swal({
                title: '错误',
                type: 'error',
                text: '用户名必须是5-10位数字或字母组成，开头不能是数字',
            }).then(() => {
                isTyping = true;
            });
         return ;
        }
        var regp=/^\S{6,16}$/;
        //检测输入内容是否匹配正则表达式
        if(regp.test(password)==false){
            swal({
                title: '错误',
                type: 'error',
                text: '密码必须是6位以上16位以内',
            }).then(() => {
                isTyping = true;
            });
            return;
        }
        if (username === "" || !password === "") {
            swal({
                title: '错误',
                type: 'error',
                text: '用户名或密码为空！',
            }).then(() => {
                isTyping = true;
            });
            return;
        }
        if (confirmPassword !== password) {
            swal({
                title: '错误',
                type: 'error',
                text: '两次密码输入不同',
            }).then(() => {
                isTyping = true;
            });
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/test/register',
            data: {
                username: username,
                password: password,
            },
            type: 'get',
            success: (data) => {
                if (data === "vaild") {
                    swal({
                        title: '注册成功',
                        type: 'success',
                        confirmButtonText:"进入大厅"
                    }).then(()=>{
                        isTyping=true;
                        window.location = "lobby";
                    });
                }
                else{
                    swal({
                        title: '错误',
                        type: 'error',
                        text: '已有重名用户',
                    }).then(() => {
                        isTyping = true;
                    });
                }
            },
            fail: () => {
                alert("unknown error")
            }
        })
    });
});