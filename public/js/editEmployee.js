document.title = "Chỉnh sửa thông tin nhân viên"

$("#imgInp").change(function () {
    readURL(this);
});
$("#btnEdit").click(function (event, err) {
    let group = $('#chucvunv').val()
    // let username = $('#username').val();
    let email = $('#emailnv').val();
    let fullname = $('#fullnamenv').val();
    let dateofbirth = $('#ngaysinhnv').val();
    let avatar=''
    let _id = new URL(window.location.href).searchParams.get('id');
    console.log(group)

    if (email != "" && fullname != "" && dateofbirth != '') {
        $.ajax('/api/user/', {
            type: "PUT",
            data: {
                _id,email, fullname, dateofbirth, group
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
});


function cancelClick() {
    window.location.href = "/employeeList";
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#avatarnv').attr('src', e.target.result);
            $('#avatarnv').css('display', 'block');
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        $('#avatarnv').css('display', 'none');

    }
}
