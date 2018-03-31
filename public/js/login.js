var isRememberPass = false
$( document ).ready(function() {
    var data = JSON.parse(localStorage.getItem("rememberpass"))
    if(data){
        $('#username').val(data.username)
        $('#password').val(data.password)
        $('#checkRemenberPass').prop('checked',true)

    }

});
$('#checkRemenberPass').click(function () {
    isRememberPass = !isRememberPass
    $(this).prop('checked',isRememberPass)
})
$('#btnLogin').click(function (event, err) {
    if(!err) {
        event.preventDefault();
        let username = $('#username').val();
        let password = $('#password').val();
        let tokenfirebase = ""
        if (!username || !password) {
            alert('Vui lòng nhập tài khoản hoặc mật khẩu!')
        } else {

            $.ajax('/api/user/login', {
                type: "POST",
                data: {
                    username, password
                },
                dataType: "json",
                success: function (data) {
                    if (data.status) {
                        if(isRememberPass){
                            localStorage.setItem('rememberpass', JSON.stringify({"username":username,"password":password}));
                        }else {
                            localStorage.removeItem('rememberpass')
                        }
                        localStorage.setItem('user', JSON.stringify(data.data));
                        window.location.href = "/"
                    } else {
                        alert(data.msg)

                    }
                },
                error: function (err) {
                    window.location.href = "/"

                    alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
                }
            });
        }
    }else {
        return
    }

})
