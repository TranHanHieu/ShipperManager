var latitude = 21.00993
var longitude = 105.80727;
// var user = user._id
// console.log(user)
var flightPlanCoordinates = []

$('#btnXemLoTrinh').click(function(event, err){
    let date = $('#tungay').val();
    $.ajax(`/api/user/historylocation?idUser="{{user._id}}"&date=${date}`, {
        type: "get",
        success: function (data) {
            if (data.status) {
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
                alert(data.msg)

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

    // Hiển thị vị trí đăng nhập của người dùng web
    var locationCurrent = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({
        position: locationCurrent,
        map: map
    });
    //vẽ đường đi
    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);

}
