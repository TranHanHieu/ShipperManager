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