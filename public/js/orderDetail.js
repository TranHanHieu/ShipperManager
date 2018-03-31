var latitudeFrom = 0;
var latitudeTo = 0;
var longtitudeFrom = 0;
var longtitudeTo = 0;
var map = null;
var pointA = null;
var pointB = null;
var idOrder = null;
var flightPlanCoordinates = [];

$(document).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));
    idOrder = getUrlVars()["idOrder"];
    
    map = new google.maps.Map(document.getElementById('mapOrderDetail'), {
        zoom: 12,
        center: new google.maps.LatLng(user.latitude, user.longtitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //Lấy thông tin đơn hàng
    $.ajax('/api/order/select?idOrder=' + idOrder, {
        type: "GET",
        dataType: "json",
        success: function (res) {
            $("#ordername").text(res.data.order_name);
            $("#from").text(res.data.from);
            $("#to").text(res.data.to);
            $("#price").text(res.data.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " VNĐ");
            $("#priceShip").text(res.data.price_ship.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " VNĐ");

            if(typeof res.data.user !== "undefined")
                $("#shipper").text(res.data.user.fullname);
            else
                $("#shipper").text("Chưa nhận đơn");
            
            if(res.data.status == -1)
                $("#statusOrder").text("Đơn bị hủy");

            if(res.data.status == 0) 
                $("#statusOrder").text("Đơn hàng mới");

            if(res.data.status == 1)
                $("#statusOrder").text("Shipper nhận đơn");

            if(res.data.status == 2 || res.data.status == 4)
                $("#statusOrder").text("Đang giao");

            if(res.data.status == 3)
                $("#statusOrder").text("Hoàn thành");

            longtitudeFrom = res.data.longtitude_from;
            latitudeFrom = res.data.latitude_from;
            longtitudeTo = res.data.longtitude_to;
            latitudeTo = res.data.latitude_to;

            if(pointA != null)
            pointA.setMap(null);

            pointA = new google.maps.Marker({
                map: map,
                label : 'A',
                position: new google.maps.LatLng(latitudeFrom, longtitudeFrom),
                title:  $("#from").text()
            });

            if(pointB != null)
                pointB.setMap(null);

            pointB = new google.maps.Marker({
                map: map,
                label : 'B',
                position: new google.maps.LatLng(latitudeTo, longtitudeTo),
                title:  $("#to").text()

            });
        },
        error: function (err) {
            window.location.href = "/orderList"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });   
    
    $.ajax('/api/order/history?idOrder=' + idOrder, {
        type: "GET",
        dataType: "json",
        success: function (res) {
            
            $.each(res.data, function( index, value ) {
                let point = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(value.latitude, value.longtitude),
                    title:  value.address
                });

                flightPlanCoordinates.push({lat: value.latitude, lng: value.longtitude});
            });

            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });
        
            flightPath.setMap(map);
        },
        error: function (err) {
            window.location.href = "/orderList"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });  

    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
});

