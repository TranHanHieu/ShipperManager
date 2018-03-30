document.title = "Danh sách đơn hàng - ShipperManager"

$( document ).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));
    if(user){
        function loadDataOrder(){
            $.ajax('/api/order/all?idlogin=' + user._id + "&isadmin=" + user.group.isadmin, {
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if(user.group.isadmin)
                    {
                        $("#clEdit").css('display', '');
                        $("#clDelete").css('display', '');
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
                            html += '<td><span>Bắt đầu giao</span></td>';

                        if(value.status === 3)
                            html += '<td><span>Hoàn thành</span></td>';

                        if(user.group.isadmin)
                        {
                            html +=
                            '<td>' +
                                '<a onclick="editOrder">' +
                                    '<img height="16" width="16" src="images/edit.png">' +
                                '</a>' +
                            '</td>' +
                            '<td><a onclick="deleteOrder"><img ' +
                                    'height="16" width="16" src="images/delete.png"></a></td>' +
                            '</tr>'
                        }

                        $("#bodyOrderList").append(html);
                      });
                },
                error: function (err) {
                    window.location.href = "/employeeList"

                    alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
                }
            });
        }
        
        loadDataOrder();
        // setInterval(function(){
        //     loadDataOrder();
        // }, 5000);
    }
});

