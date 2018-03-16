const mongoose = require('mongoose');
const ordersSchema = require('./ordersSchema');
let ordersModel = mongoose.model('orders', ordersSchema);

//status : 
// -1: Đơn bị hủy
// 0: Đơn hàng mới
// 1: Nhận đơn
// 2: Bắt đầu giao
// 3: Hoàn thành

const createOrder = async(order) => {
    try
    {
        return await ordersModel.create(order);
    }
    catch(err)
    {
        return null;
    }
}

const selectOrderNew = async ({}) => {
    try
    {
        return await ordersModel.find({status : 0}).exec();
    }
    catch(err)
    {
        return null;
    }
}

const updateStatusOrder = async(idorder, status) => {
    try
    {
        return await ordersModel.findOneAndUpdate(idorder, {status : status}).exec();
    }
    catch(err)
    {
        return null;
    }
}
module.exports = {
    selectOrderNew, updateStatusOrder
}