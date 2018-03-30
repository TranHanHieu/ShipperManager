document.title = "Thêm nhân viên"

function cancelClick() {
    window.location.href = "/employeeList";
}

$("#btnSummit").click(function (event,err) {
    if(!err) {
        event.preventDefault()
        let group = $('#chucvunv').val()
        let username = $('#username').val();
        let password = $('#matkhau').val();
        let passwordXn = $('#xnmatkhau').val();
        let email = $('#emailnv').val();
        let fullname = $('#fullnamenv').val();
        let dateofbirth = $('#ngaysinhnv').val();
        console.log(group)

        if (username != "" && password != "" && email != "" && fullname != "" && password == passwordXn) {
            $.ajax('/api/user/', {
                type: "POST",
                data: {
                    username, password, email, fullname, dateofbirth, group
                },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.status) {
                        window.location.href = "/employeeList"
                    } else {
                        alert(data.msg)

                    }
                },
                error: function (err) {
                    console.log(err)

                    alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
                }
            });
        } else {
            alert("Vui lòng nhập đầy đủ thông tin nhân viên hoặc mật khẩu xác nhận không đúng!")
        }
    }else {
        return
    }
});
