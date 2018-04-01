var latitudeFrom = 0;
var latitudeTo = 0;
var longtitudeFrom = 0;
var longtitudeTo = 0;
var map = null;
var pointA = null;
var pointB = null;
var idOrder = null;

document.title = "Chỉnh sửa đơn hàng - ShipperManager";

$(document).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));
    idOrder = getUrlVars()["idOrder"];

    $("#price").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $("#priceShip").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $("#btnEditOrder").click(function() {
        var data = {
            idOrder : idOrder,
            order_name : $("#ordername").val(),
            from : $("#from").val(),
            to : $("#to").val(),
            price : parseFloat($("#price").val()),
            price_ship : parseFloat($("#priceShip").val()),
            longtitude_from : longtitudeFrom,
            latitude_from : latitudeFrom,
            longtitude_to : longtitudeTo,
            latitude_to : latitudeTo
        }

        $.ajax('/api/order/editOrder', {
            type: "PUT",
            data: data,
            dataType: "json",
            success: function (data) {
                alert(data.msg);
                window.location.href = "/orderList"
            },
            error: function (err) {
                window.location.href = "/orderList"

                alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
            }
        });
    });

    $.ajax('/api/order/select?idOrder=' + idOrder, {
        type: "GET",
        dataType: "json",
        success: function (res) {

            map = new google.maps.Map(document.getElementById('mapEditOrder'), {
                zoom: 12,
                center: new google.maps.LatLng(res.data.latitude_from,  res.data.longtitude_from),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            if(res.data.status !== 0)
            {
                $("#ordername").prop('disabled', true);
                $("#from").prop('disabled', true);
                $("#to").prop('disabled', true);
                $("#price").prop('disabled', true);
                $("#priceShip").prop('disabled', true);
                $("#btnEditOrder").prop('disabled', true);
            }
           
            $("#ordername").val(res.data.order_name);
            $("#from").val(res.data.from);
            $("#to").val(res.data.to);
            $("#price").val(res.data.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            $("#priceShip").val(res.data.price_ship.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            
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
                title:  $("#from").val()
            });

            if(pointB != null)
                pointB.setMap(null);

            pointB = new google.maps.Marker({
                map: map,
                label : 'B',
                position: new google.maps.LatLng(latitudeTo, longtitudeTo),
                title:  $("#to").val()
            });

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

function getLocationFrom()
{
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCrjwpPbnkNqjFezK3RiIQ--DnK3MmLdoU&address=' + $("#from").val(), {
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.status)
            {
                latitudeFrom = data.results[0].geometry.location.lat;
                longtitudeFrom = data.results[0].geometry.location.lng;
                if(pointA != null)
                    pointA.setMap(null);

                pointA = new google.maps.Marker({
                    map: map,
                    label : 'A',
                    position: new google.maps.LatLng(latitudeFrom, longtitudeFrom),
                    title:  $("#from").val()
                  });
            }
        },
        error: function (err) {
            window.location.href = "/addOrder"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });    
}

function getLocationTo()
{
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCrjwpPbnkNqjFezK3RiIQ--DnK3MmLdoU&address=' + $("#to").val(), {
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data.status)
            {
                latitudeTo = data.results[0].geometry.location.lat;
                longtitudeTo = data.results[0].geometry.location.lng;
                if(pointB != null)
                    pointB.setMap(null);

                pointB = new google.maps.Marker({
                    map: map,
                    label : 'B',
                    position: new google.maps.LatLng(latitudeTo, longtitudeTo),
                    title:  $("#to").val()
                  });
            }
        },
        error: function (err) {
            window.location.href = "/addOrder"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });    
}