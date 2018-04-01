var latitudeFrom = 0;
var latitudeTo = 0;
var longtitudeFrom = 0;
var longtitudeTo = 0;
var map = null;
var pointA = null;
var pointB = null;
var idOrder = null;
var listHistory = [];
var loadData = null;
var listMaker = [];
var path = null;

$(document).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));
    idOrder = getUrlVars()["idOrder"];

    //Khai báo map
    map = new google.maps.Map(document.getElementById('mapReceiveOrder'), {
        zoom: 12,
        center: new google.maps.LatLng(user.latitude, user.longtitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

      //Khai báo đường kẻ
    poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    //Lấy thông tin đơn hàng
    loadData = function load() {
            $.ajax('/api/order/select?idOrder=' + idOrder, {
            type: "GET",
            dataType: "json",
            success: function (res) {
                //Nếu trạng thái là mới
                if(res.data.status === 0)
                {
                    $("#btnSaveLatLng").prop('disabled', true);
                    $("#btnSuccess").prop('disabled', true);
                    $("#btnDeleteLatLng").prop('disabled', true);
                    $("#btnReceive").prop('disabled', false);
                }

                //Nếu trạng thái là hủy hoặc hoàn thành
                else if(res.data.status === -1 || res.data.status === 3)
                {
                    $("#btnReceive").prop('disabled', true);
                    $("#btnSaveLatLng").prop('disabled', true);
                    $("#btnSuccess").prop('disabled', true);
                    $("#btnDeleteLatLng").prop('disabled', true);
                }

                //Nếu đang trong giao hàng
                else
                {
                    //Sự kiện click vào bản đồ
                    map.addListener('click', addLatLng);
                    $("#btnReceive").prop('disabled', true);
                    $("#btnSaveLatLng").prop('disabled', false);
                    $("#btnSuccess").prop('disabled', false);
                    $("#btnDeleteLatLng").prop('disabled', false);
                }

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

                //Lấy điểm A
                if(pointA != null)
                pointA.setMap(null);

                pointA = new google.maps.Marker({
                    map: map,
                    label : 'A',
                    position: new google.maps.LatLng(latitudeFrom, longtitudeFrom),
                    title:  $("#from").text()
                });

                //Lấy điểm B
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


        //Lấy lộ trình nè
        $.ajax({
            url:'/api/order/history?idOrder=' + idOrder,
            method:"GET",

            success:function(res) {
                path = [];
                console.log(res);
                
                $.each(res.data, function( index, value ) {
                    listMaker.push(new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(value.latitude, value.longtitude),
                        title:  value.address
                    }));

                    listHistory.push(
                        {
                            order : idOrder,
                            address : value.address,
                            longtitude : value.longtitude,
                            latitude : value.latitude
                        }
                    );
    
                    path.push({lat: value.latitude, lng: value.longtitude});
                });

                poly.setPath(path);
                poly.setMap(map);
           },
           error:function(){
            alert("error");
           }
          });
    }
    
    //Load Data
    loadData();

    

    $("#btnReceive").click(function() {
        $.ajax({
            url:"/api/order/receive",
            method:"POST", 
            data:{
                order : idOrder,
                user : user._id,
            },

            success:function(res) {
                alert(res.msg);
                loadData();
           },
           error:function(){
            alert("error");
           }
          });
    });

    //Xử lý nút xóa lộ trình
    $("#btnDeleteLatLng").click( function() {
        //Nếu click thì xóa hết maker nhưng ko xóa điểm A, B
        deleteMarkers();

        //Xóa trong db
        $.ajax({
            url:"/api/order/deleteHistory?idOrder=" + idOrder,
            method:"DELETE",
            success:function(res) {
                //Không show ra gì cả
                listHistory = [];
           },
           error:function(err){
                alert("Có lỗi xảy ra!");
           }
          });
    });

    //Xử lý nút lưu lộ trình
    $("#btnSaveLatLng").click(function() {
        $.ajax({
            url:"/api/order/shipping",
            method:"POST", 
            data:{
                listHistory : listHistory
            },

            success:function(res) {
                alert("Lưu lộ trình thành công!");
                loadData();
           },
           error:function(){
            alert("error");
           }
          });
    });

    //Xử lý nút hoàn thành nè
    $("#btnSuccess").click(function() {
        $.ajax({
            url:"/api/order/complete",
            method:"POST", 
            data:{
                order : idOrder,
                user : user._id,
            },

            success:function(res) {
                alert("Đơn hàng đã hoàn thành!");
                loadData();
           },
           error:function(){
            alert("error");
           }
          });
    });

    function setMapOnAll(map) {
        for (var i = 0; i < listMaker.length; i++) {
            listMaker[i].setMap(map);
        }

        listMaker = [];
        path = poly.setPath([]);
      }

      // Xóa maker nè
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Hiển thị hết maker nè
      function showMarkers() {
        setMapOnAll(map);
      }

      // Xóa hết maker nè
      function deleteMarkers() {
        clearMarkers();
        listMaker = [];
        listHistory = [];
      }


    function addLatLng(event) {
        //Lấy địa chỉ nè
        var address ="";
        poly.setMap(map);
        path = poly.getPath();
        path.push(event.latLng);

        $.ajax({
            url:"https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCrjwpPbnkNqjFezK3RiIQ--DnK3MmLdoU&latlng=" + event.latLng.lat() + "," + event.latLng.lng(),
            method:"GET",
            success:function(res) {
               
                address = res.results[0].formatted_address;
             
                //Lưu vào mảng địa chỉ nè
                listHistory.push(
                    {
                        order : idOrder,
                        address : address,
                        longtitude : event.latLng.lng(),
                        latitude : event.latLng.lat()
                    }
                );
           },
           error:function(err){
                alert("Có lỗi xảy ra!");
           }
          });

        //Thêm cái maker này
        listMaker.push(new google.maps.Marker({
            map: map,
          position: event.latLng,
          title: address
        }));
    }

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
