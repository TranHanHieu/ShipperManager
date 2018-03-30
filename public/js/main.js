$('#btnLogOut').click(function () {
    window.location.href = '/logout'
})
$('#btnChangePass').click(function () {
    window.location.href = '/changepass'
})
if (typeof(Storage) !== "undefined") {
    var user = JSON.parse(localStorage.getItem("user"))
    console.log(user)
    document.getElementById("userNameLb").innerHTML = user.fullname;
    document.getElementById("fullname").innerHTML = user.fullname;
    document.getElementById("email").innerHTML = 'Email: '+ user.email;
    document.getElementById("chucvu").innerHTML = 'Chức vụ: '+ user.group.groupname;
    document.getElementById("avatarUser").src = user.avatar
    document.getElementById("avatar").src = user.avatar
    document.getElementById("ngaysinh").innerHTML = 'Ngày sinh: '+ user.dateofbirth
} else {
    alert('Lỗi! Trình duyệt của bạn không hỗ trợ Web Storage')
}
