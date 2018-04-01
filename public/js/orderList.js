document.title = "Danh sách đơn hàng - ShipperManager"
var load = null;
function deleteOrder(id, status)
{
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
                window.location.href = "/orderList"

                alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
            }
        });
    }
}

$( document ).ready(function() {
    var user = JSON.parse(localStorage.getItem("user"));

    if(user){

        load = function loadDataOrder(){
            $.ajax('/api/order/all?idlogin=' + user._id + "&isadmin=" + user.group.isadmin, {
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if(user.group.isadmin)
                    {
                        $("#clEdit").css('display', '');
                        $("#clDelete").css('display', '');
                        $('#btnAddNewOrder').css('float', 'left');
                        $('#btnAddNewOrder').css('display', '');
                    }
                    else
                    {
                        $('#clReceive').css('display', '');
                    }

                    $("#bodyOrderList").html("");
                    $.each(data.data, function( index, value ) {
                        var html = 
                        '<tr>' +
                        '<td><span>'+ ++index +'</span></td>' +
                        '<td><span>'+ value.order_name +'</span></td>' +
                        '<td><span>'+ value.from +'</span></td>' +
                        '<td><span>'+ value.to +'</span></td>' +
                        '<td><span>'+ value.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") +'</span></td>' +
                        '<td><span>'+ value.price_ship.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") +'</span></td>';
                        
                        if(value.status == 0 || value.status == -1)
                            html += '<td style="text-align : center"><span class="label label-warning">Chưa nhận đơn</span></td>';
                        else
                            html += '<td style="text-align : center"><span class="label label-primary">'+ value.user.fullname +'</span></td>';
                        //status : 
                        // -1: Đơn bị hủy
                        // 0: Đơn hàng mới
                        // 1: Nhận đơn
                        // 2: Bắt đầu giao
                        // 3: Hoàn thành

                        if(value.status === -1)
                            html += '<td style="text-align : center"><span class="label label-danger">Đơn bị hủy</span></td>';

                        if(value.status === 0)
                            html += '<td style="text-align : center"><span class="label label-default">Đơn hàng mới</span></td>';

                        if(value.status === 1)
                            html += '<td style="text-align : center"><span class="label label-info">Shipper nhận đơn</span></td>';

                        if(value.status === 2)
                            html += '<td style="text-align : center"><span class="label label-warning">Đang giao</span></td>';

                        if(value.status === 3)
                            html += '<td style="text-align : center"><span class="label label-success">Hoàn thành</span></td>';

                        html += '<td><span>'+ moment(moment.utc(moment.utc().format(value.createdAt)).toDate()).local().format('HH:mm:ss DD-MM-YYYY') +'</span></td>';

                        html += '<td>' +
                                    '<a href="/orderDetail?idOrder='+ value._id +'">' +
                                        '<img height="16" width="16" src="images/detail.png">' +
                                    '</a>' +
                                '</td>';

                        if(user.group.isadmin)
                        {
                            html +=
                            '<td>' +
                                '<a href="/editOrder?idOrder='+ value._id +'">' +
                                    '<img height="16" width="16" src="images/edit.png">' +
                                '</a>' +
                            '</td>' +
                            '<td><a onclick="deleteOrder(\'' + value._id + '\', \'' + value.status + '\')"><img ' +
                                    'height="16" width="16" src="images/delete.png"></a></td>' +
                            '</tr>'
                        }
                        else
                        {
                            html +=
                            '<td>' +
                                '<a href="/receiveOrder?idOrder='+ value._id +'">' +
                                    '<img height="16" width="16" src="images/receive.png">' +
                                '</a>' +
                            '</td>' +
                            '</tr>'
                        }
                        
                        

                        $("#bodyOrderList").append(html);
                      });
                },
                error: function (err) {
                    window.location.href = "/orderList"

                    alert('Lỗi! Không có kết nối, vui lòng thử lại sau.' + err)
                }
            });
        }

        load();

        setInterval(function(){
            console.log("Vào NÈ");
            load();
        }, 10000);

        //$('#tableOrder').DataTable();
        
    }

    $("#btnAddNewOrder").click(function() {
        window.location.href = "/addOrder"
    });

});

