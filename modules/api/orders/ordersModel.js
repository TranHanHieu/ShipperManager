const mongoose = require('mongoose');
const ordersSchema = require('./ordersSchema');
let ordersModel = mongoose.model('orders', ordersSchema, 'orders');
const order_userModel = require('../order_user/order_userModel');
const config = require('../../../configString.json');
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

//Lấy danh sách đơn hàng này

const selectAllOrder = async(idUser, isAdmin) => {
    try
    {
        if(isAdmin === 'true')
        {
            return await ordersModel.find({}).exec();
        }
        else
        {
            return await order_userModel.selectByIdUser(idUser);
        }
    }
    catch(err)
    {
        return null;
    }
};

const deleteOrder = async(idOrder) => {
    try
    {
        let result = await order_userModel.selectByIdOrder(idOrder);
        if(result.length > 0)
        {
            return config.KHONG_THE_XOA_DON_HANG;
        }
        else
        {
            await ordersModel.remove({_id : idOrder}).exec();
            return config.THANH_CONG;
        }
    }
    catch(err)
    {
        return config.KHONG_THANH_CONG;
    }
}

module.exports = {
    selectOrderNew, updateStatusOrder, selectAllOrder, deleteOrder
}