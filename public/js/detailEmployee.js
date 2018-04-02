
var latitude = 21.00993
var longitude = 105.80727;
var flightPlanCoordinates = []
var today = moment().format('YYYY-MM-DD');
document.getElementById("tungay").value = today;
$(document).ready(function () {
    //hiển thị 1 lần nên k get bằng ajax
    // getDetailUser()
})
$('#btnXemLoTrinh').click(function(event, err){
    let date = $('#tungay').val();
    let user_id = new URL(window.location.href).searchParams.get('id');

    $.ajax(`/api/user/location/history?id=${user_id}&date=${date}`, {
        type: "get",
        success: function (data) {
            if (data.status) {
                console.log(data)
                flightPlanCoordinates = []
                for(let i =0 ;i<data.data.length;i++){
                    //21.00975,105.83116,
                    flightPlanCoordinates.push(
                        {
                            lat: data.data[i].longtitude, lng: data.data[i].latitude
                        }
                    )

                }
                initMap()
            } else {
                alert(`Ngày ${moment(date).format('DD/MM/YYYY')}, không có lộ trình nào! `)

            }
        },
        error: function (err) {
            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });
})

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    if(flightPlanCoordinates.length>2) {
        var locationStart = {lat: flightPlanCoordinates[0].lat, lng: flightPlanCoordinates[0].lng};
        var markerStart = new google.maps.Marker({
            position: locationStart,
            icon:'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
            map: map
        });
        var locationEnd = {
            lat: flightPlanCoordinates[flightPlanCoordinates.length - 1].lat,
            lng: flightPlanCoordinates[flightPlanCoordinates.length - 1].lng
        };
        var markerEnd = new google.maps.Marker({
            position: locationEnd,
            icon:'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
            map: map
        });

    }else {
        var marker = new google.maps.Marker({
            position: {lat:latitude,lng:longitude},
            map: map
        });

    }
    //vẽ đường đi
    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    flightPath.setMap(map);

}
function getDetailUser() {
    let user_id = new URL(window.location.href).searchParams.get('id');
    $.ajax(`/api/user/${user_id}`, {
        type: "get",
        success: function (data) {
            console.log(data)
            if (data.status) {
                $('#emailnv').val(data.data.email)
                $('#fullnamenv').val(data.data.fullname)
                $('#chucvuNv').html(data.data.group.groupname)
                $('#username').val(data.data.username)
                $('#ngaysinhnv').val(data.data.dateofbirth)
                // flightPlanCoordinates = []
                // for(let i =0 ;i<data.data.length;i++){
                //     //21.00975,105.83116,
                //     flightPlanCoordinates.push(
                //         {
                //             lat: data.data[i].longtitude, lng: data.data[i].latitude
                //         }
                //     )
                //
                // }
                // initMap()
            } else {
                window.location.href = "/employeeList"
                alert('Lỗi, không lấy được thông tin nhân viên')

            }
        },
        error: function (err) {
            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });

}
