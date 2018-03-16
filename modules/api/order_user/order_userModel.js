const mongoose = require('mongoose');
const order_userSchema = require('./order_userSchema');
let order_userModel = mongoose.model('order_user', order_userSchema, 'order_user');

const ordersModel = require('../orders/ordersModel');
const ship_historyModel = require('../ship_history/ship_historyModel');
//status : 
// -1: Đơn bị hủy
// 0: Đơn hàng mới
// 1: Nhận đơn
// 2: Bắt đầu giao
// 3: Hoàn thành

//Xử lý đơn hàng
const receiveOrder = async (order_user, status, longtitude, latitude) => {
    try
    {
        var history = {
            order : order_user.order,
            longtitude : longtitude,
            latitude : latitude
        }


        //Nhận đơn
        if(status === 1)
        {
            let result = await order_userModel.create(order_user);
            if(result != null && result != {})
            {
                return await ordersModel.updateStatusOrder(order_user.order, 1);
            }
        }
        else if(status === 2 || status === 3)
        {
            //Thêm tọa độ tại điểm nhận đơn hoặc kết thúc
           
            await ship_historyModel.insertHistory(history);
            
            //Update trạng thái thành 2, 3
            return await ordersModel.updateStatusOrder(order_user.order, status);
        }
        else if(status === 4)
        {
            await ship_historyModel.insertHistory(history);
        }
        else 
        {
            //đơn hàng Bị hủy
            return await ordersModel.updateStatusOrder(order_user.order, -1);
        }
    }
    catch(err)
    {
        return null;
    }
}


module.exports = {
    receiveOrder
}