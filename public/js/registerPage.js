$(document).ready(() => {
  $("#register").click((e) => {
    let username = $("#username_input_reg").val();
    let password = $("#pass_input_reg").val();
    let confirmPassword = $("#pass_input_cf").val();
    if (username === "" || !password === "") {
      alert("用户名或密码为空");
      return;
    }
    if (confirmPassword !== password) {
      console.log([confirmPassword, password]);
      alert("密码与确认密码不符");
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
        alert(data);
        window.location="lobby";
      },
      fail: () => {
        alert("unknown error")
      }
    })
  });
});