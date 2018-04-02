var latitudeFrom = 0;
var latitudeTo = 0;
var longtitudeFrom = 0;
var longtitudeTo = 0;
var map = null;
var pointA = null;
var pointB = null;
var idOrder = null;
var flightPlanCoordinates = [];
var load = null;

document.title = "Thông tin chi tiết đơn hàng - ShipperManager";

$(document).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));
    idOrder = getUrlVars()["idOrder"];

    map = new google.maps.Map(document.getElementById('mapOrderDetail'), {
        zoom: 12,
        center: new google.maps.LatLng(user.latitude, user.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    load = function loadData() {
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
                {
                    $("#shipper").text(res.data.user.fullname);
                    $("#shipper").attr("class","label label-primary");
                }
                else
                {
                    $("#shipper").text("Chưa nhận đơn");
                    $("#shipper").attr("class","label label-warning");
                }
                
                if(res.data.status == -1)
                {
                    $("#statusOrder").text("Đơn bị hủy");
                    $("#statusOrder").attr("class","label label-danger");
                }

                if(res.data.status == 0) 
                {
                    $("#statusOrder").text("Đơn hàng mới");
                    $("#statusOrder").attr("class","label label-default");
                }

                if(res.data.status == 1)
                {
                    $("#statusOrder").text("Shipper nhận đơn");
                    $("#statusOrder").attr("class","label label-info");
                }

                if(res.data.status == 2)
                {
                    $("#statusOrder").text("Đang giao");
                    $("#statusOrder").attr("class","label label-warning");
                }

                if(res.data.status == 3)
                {
                    $("#statusOrder").text("Hoàn thành");
                    $("#statusOrder").attr("class","label label-success");
                }

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
    }
    
    load();

    setInterval(function(){
        load();
    }, 10000);

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
