document.title = "Chỉnh sửa thông tin nhân viên"

$("#imgInp").change(function () {
    readURL(this);
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
