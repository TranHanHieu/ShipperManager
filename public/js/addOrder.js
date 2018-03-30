var latitudeFrom = 0;
var latitudeTo = 0;
var longtitudeFrom = 0;
var longtitudeTo = 0;
var map = null;
var pointA = null;
var pointB = null;

$(document).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));
    map = new google.maps.Map(document.getElementById('map3'), {
        zoom: 12,
        center: new google.maps.LatLng(user.latitude, user.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

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

    $("#btnAddNewOrder").click(function() {
        var data = {
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

        $.ajax('/api/order/addOrder', {
            type: "POST",
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
});

function getLocationFrom()
{
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCrjwpPbnkNqjFezK3RiIQ--DnK3MmLdoU&address=' + $("#from").val(), {
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
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

                console.log(pointA);
            }
        },
        error: function (err) {
            console.log(err);
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
            console.log(err);
            window.location.href = "/addOrder"

            alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
        }
    });    
}