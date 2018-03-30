document.title = "Danh sách đơn hàng - ShipperManager"
var load = null;
function deleteOrder(id, status)
{
    console.log(id + "status" + status);
    if(confirm("Bạn có chắc chắn muốn xóa đơn hàng này?"))
    {
        $.ajax('/api/order/deleteOrder?idOrder=' + id + "&status=" + status, {
            type: "GET",
            dataType: "json",
            success: function (data) {
                alert(data.msg);
                load();
            },
            error: function (err) {
                console.log(err);
                window.location.href = "/orderList"

                alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
            }
        });
    }
}

$( document ).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map2'), {
            zoom: 13,
            center: new google.maps.LatLng(user.latitude, user.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }
    
    if(user){

        load = function loadDataOrder(){
            $.ajax('/api/order/all?idlogin=' + user._id + "&isadmin=" + user.group.isadmin, {
                type: "GET",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if(user.group.isadmin)
                    {
                        $("#clEdit").css('display', '');
                        $("#clDelete").css('display', '');
                        $('#btnAddNewOrder').css('float', 'left');
                        $('#btnAddNewOrder').css('display', '');
                    }

                    $("#bodyOrderList").html("");
                    $.each(data.data, function( index, value ) {
                        var html = 
                        '<tr>' +
                        '<td><span>'+ ++index +'</span></td>' +
                        '<td><span>'+ value.order_name +'</span></td>' +
                        '<td><span>'+ value.from +'</span></td>' +
                        '<td><span>'+ value.to +'</span></td>' +
                        '<td><span>'+ value.price +'</span></td>' +
                        '<td><span>'+ value.price_ship +'</span></td>';
                        
                        if(value.status == 0 || value.status == -1)
                            html += '<td><span>Chưa nhận đơn</span></td>';
                        else
                            html += '<td><span>'+ value.user.fullname +'</span></td>';
                        //status : 
                        // -1: Đơn bị hủy
                        // 0: Đơn hàng mới
                        // 1: Nhận đơn
                        // 2: Bắt đầu giao
                        // 3: Hoàn thành

                        if(value.status === -1)
                            html += '<td><span>Đơn bị hủy</span></td>';

                        if(value.status === 0)
                            html += '<td><span>Đơn hàng mới</span></td>';

                        if(value.status === 1)
                            html += '<td><span>Shipper nhận đơn</span></td>';

                        if(value.status === 2)
                            html += '<td><span>Đang giao</span></td>';

                        if(value.status === 3)
                            html += '<td><span>Hoàn thành</span></td>';

                        html += '<td><span>'+ value.createdAt +'</span></td>';

                        if(user.group.isadmin)
                        {
                            html +=
                            '<td>' +
                                '<a onclick=editOrder(' + value._id + ')>' +
                                    '<img height="16" width="16" src="images/edit.png">' +
                                '</a>' +
                            '</td>' +
                            '<td><a onclick="deleteOrder(\'' + value._id + '\', \'' + value.status + '\')"><img ' +
                                    'height="16" width="16" src="images/delete.png"></a></td>' +
                            '</tr>'
                        }
                        
                        

                        $("#bodyOrderList").append(html);
                      });
                },
                error: function (err) {
                    console.log(err);
                    window.location.href = "/orderList"

                    alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
                }
            });
        }

       

        
        load();
        initMap();
        // setInterval(function(){
        //     loadDataOrder();
        // }, 5000);

        
    }

    $("#btnAddNewOrder").click(function() {
        window.location.href = "/addOrder"
    });

});

