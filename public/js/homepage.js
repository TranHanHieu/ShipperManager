var listLocationUser = [];
var longitude = '';
var latitude = '';
$(document).ready(function () {
    $.ajax('/api/user/', {
        type: "GET",
        success: function (data) {
            console.log(data.data);
            if (data.status) {
                let users = data.data
                for (let i = 0; i < users.length; i++) {
                    var customMarket = '<div><div><img id="avatar" style="width: 40px;float:left;height: 40px;border-radius:25px " src="'+users[i].avatar+'"/><h4 style="text-align: center;float: left;margin: 10px">' + users[i].fullname + '</h4></div><h5 style="text-align: center">' + users[i].group.groupname + '</h5><div style="margin: auto;display: table"><img style="float: left;width: 30px;height: 30px;border-radius:20px " src="images/shipper_icon.png"/><h5 style="margin: 10px;float: left">' + users[i].trangthai + '</h5></div></div>'

                    listLocationUser.push([customMarket,
                        users[i].longitude, users[i].latitude, users[i].acc])
                }
                initMap()
            } else {
                alert(data.msg)

            }
        },
        error: function (err) {
            console.log(err)
            // window.location.href = "/"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });
    // Xin quyền truy cập vị trí
    navigator.permissions.query({'name': 'geolocation'})
        .then( permission => console.log(permission) )

    // Lấy vị trí hiện tại khi người dùng đăng nhập
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        alert("GPS không được trình duyệt hỗ trợ.")
    }


})

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
    console.log(listLocationUser)

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
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Đơn hàng đã nhận', "Đơn hàng bị hủy", 'Nhân viên'],
        ['2013', 1000, 400, 500],
        ['2014', 1170, 460, 300],
        ['2015', 660, 1120, 700],
        ['2016', 1030, 540, 890]
    ]);

    var options = {
        title: 'Đơn vị (VNĐ)',
        hAxis: {title: 'Biểu đồ thống kê hoạt động trong tháng', titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}