document.title = "Danh sách nhân viên - ShipperManager"

var user = JSON.parse(localStorage.getItem("user"));

$(document).ready(function () {
    //phân quyền cho tài khoản,
    if (user.group.isadmin) {
        $('#tbBodyNoAdmin').css('display', 'none')
    }else {
        $('#tbBodyAdmin').css('display', 'none')
        $('#thEdit').css('display', 'none')
        $('#thDelete').css('display', 'none')
        $('#btnAddEmploye').css('display', 'none')
    }
})
$("#btnAddEmploye").click(function (e) {
    window.location.href = '/addEmployee'
})

function deleteEmployee(id, name) {
    console.log(id, name);
    let result = confirm(`Bạn có muốn xóa ${name}? `)
    if (result) {
        window.location.href = `/delete?id=${id}`
    }
}