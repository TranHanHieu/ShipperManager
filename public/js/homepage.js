var listLocationUser = [];
var latitude = 21.00993
var longitude = 105.80727

var user = JSON.parse(localStorage.getItem("user"));
if(!user.group.isadmin)
{
    $("#homeContent").html('<p> Bạn không có quyền truy cập. Nhấn<a  href="/orderList"> vào đây </a>quay lại!</p>');
}

// auto refresh data sau 1 minutes
setInterval(function() {
    getAllUser()
    getCountUserTrangThai(3)
    getCountUserTrangThai(4)
    getCountOrderTrangThai(0)
    getCountOrderTrangThai(-1)
}, 60*1000);

$(document).ready(function () {
    getAllUser()
    getCountUserTrangThai(3)
    getCountUserTrangThai(4)
    getCountOrderTrangThai(0)
    getCountOrderTrangThai(-1)

    // Xin quyền truy cập vị trí
    navigator.permissions.query({'name': 'geolocation'})
        .then( permission => console.log(permission) )

    // Lấy vị trí hiện tại khi người dùng đăng nhập
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        latitude = 21.00993
        longitude = 105.80727

        alert("GPS không được trình duyệt hỗ trợ.")
    }


})

function getCountUserTrangThai(trangthai) {
    $.ajax(`/api/user/count?trangthai=${trangthai}`, {
        type: "GET",
        success: function (data) {
            if (data.status) {
                if(trangthai==3){
                    $('#tvShipping').html(data.data)
                }else if(trangthai ==4){
                    $('#tvDangRanh').html(data.data)
                }

            } else {
                alert(data.msg)

            }
        },
        error: function (err) {
            // window.location.href = "/"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });
}
function getCountOrderTrangThai(trangthai) {
    $.ajax(`/api/order/count?trangthai=${trangthai}`, {
        type: "GET",
        success: function (data) {
            if (data.status) {
                if(trangthai == 0){
                    $('#tvDonHangMoi').html(data.data)
                }else if(trangthai == -1){
                    $('#tvDonHangBiHuy').html(data.data)
                }

            } else {
                alert(data.msg)

            }
        },
        error: function (err) {
            // window.location.href = "/"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });
}

function getAllUser() {
    $.ajax('/api/user/', {
        type: "GET",
        success: function (data) {
            if (data.status) {
                let users = data.data
                for (let i = 0; i < users.length; i++) {
                    var trangthai = '';
                    var mautrangthai = '';
                    if(users[i].trangthai == 1){
                        trangthai = 'Mất tín hiệu'
                        mautrangthai = 'red'
                    }else if(users[i].trangthai == 2){
                        trangthai = 'Đang trực tuyến'
                        mautrangthai = 'hotpink'
                    }else if(users[i].trangthai == 3){
                        trangthai = 'Đang giao hàng'
                        mautrangthai = 'blue'
                    }else {
                        trangthai = 'Đang rảnh'
                        mautrangthai = 'green'
                    }
                    var customMarket = '<div><div><img id="avatar" style="width: 40px;float:left;height: 40px;border-radius:25px " src="'+users[i].avatar+'"/><h4 style="text-align: center;float: left;margin: 10px">' + users[i].fullname + '</h4></div>' +
                        '<h5 style="text-align: center">' + users[i].group.groupname + '</h5>' +
                        '<div style="margin: auto;display: table"><img style="float: left;width: 30px;height: 30px;border-radius:20px " src="images/shipper_icon.png"/><h5 style="margin: 10px;color: '+mautrangthai+';float: left">' + trangthai + '</h5></div>' +
                        '<div style="display: table;margin: auto"><i class="fa fa-map-marker" style="margin-left: 10px;margin-right: 10px;float: left;font-size:16px;color:red"></i><a style="float: left" href="detailEmployee?id='+users[i]._id+'">Xem lộ trình</a></div></div>'

                    listLocationUser.push([customMarket,
                        users[i].longitude, users[i].latitude, users[i].acc])
                }
                initMap()
            } else {
                //alert(data.msg)

            }
        },
        error: function (err) {
            // window.location.href = "/"

            //alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });
}

function setPosition(position) {

    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Hiển thị vị trí đăng nhập của người dùng web
    var locationCurrent = {lat: latitude, lng: longitude};
    var marker1 = new google.maps.Marker({
        position: locationCurrent,
        map: map
    });
    // Hiển thị vị trí, trạng thái của tất cả nhân viên
    var infowindow = new google.maps.InfoWindow();

    var marker, i;


    for (i = 0; i < listLocationUser.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(listLocationUser[i][1], listLocationUser[i][2]),
            map: map,
            icon: 'images/shipper_icon.png'
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(listLocationUser[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

//set up chart
google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var listData = [];
    var orderCancel = 0;
    var orderNew = 0;
    var orderReceive = 0;

    listData.push(['Ngày', 'Tất cả đơn hàng', "Đơn hàng bị hủy", "Đơn hàng chưa nhận", 'Đơn hàng đã nhận']);

    //Lấy dữ liệu biểu đồ nè
    $.ajax('/api/order/chart', {
        type: "GET",
        success: function (res) {
            $.each(res.data, function(index, value) {
                let date = new Date(value._id.year, value._id.month - 1, value._id.day);

                //Lấy số lượng ở các trạng thái
                $.each(value.statuses, function(i, v) {
                    //Đơn hàng bị hủy
                    if(v.key == -1)
                    {
                        orderCancel += v.value;
                    }
                    //Đơn hàng chưa nhận
                    else if(v.key == 0)
                    {
                        orderNew += v.value;
                    }

                    //Đơn hàng đã nhận
                    else
                    {
                        orderReceive += v.value;
                    }

                });

                listData.push([moment(date).format('DD/MM/YYYY'), value.count, orderCancel, orderNew, orderReceive]);
                
                orderCancel = 0;
                orderNew = 0;
                orderReceive = 0;
              });

              var data = google.visualization.arrayToDataTable(listData);

              var options = {
                  title: 'Đơn vị (Số lượng)',
                  hAxis: {title: 'Biểu đồ thống kê hoạt động trong tháng', titleTextStyle: {color: '#333'}},
                  vAxis: {minValue: 0}
              };
          
              var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
              chart.draw(data, options);
        },
        error: function (err) {
        }
    });
}