$(document).ready(() => {

  $(window).keypress((e)=>{//监听回车
    console.log(e.keyCode);
    if(e.keyCode===13){
      $("#login").click();
    }
  });

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
        alert(data);
        if (data === "登陆成功") {
          window.location = "lobby"
        }
      },
      fail: (data) => {
        alert(data)
      }
    })
  });
});