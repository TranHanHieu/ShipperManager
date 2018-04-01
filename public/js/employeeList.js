
var user = JSON.parse(localStorage.getItem("user"));
if(!user.group.isadmin)
{
    $("#employeeListContent").html('<p> Bạn không có quyền truy cập. Nhấn<a  href="/orderList"> vào đây </a>quay lại!</p>');
}

document.title = "Danh sách nhân viên - ShipperManager"
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