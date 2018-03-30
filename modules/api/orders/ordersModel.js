const mongoose = require('mongoose');
const ordersSchema = require('./ordersSchema');
let ordersModel = mongoose.model('orders', ordersSchema, 'orders');
const order_userModel = require('../order_user/order_userModel');
const userSchema = require('../users/usersSchema');
let userModel = mongoose.model('users', userSchema);
const config = require('../../../configString.json');
const moment = require('moment-timezone');
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
        console.log(err);
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

const selectOrderById = async (id) => {
    try
    {
        return await ordersModel.findOne({_id : id}).exec();
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

const updateUserInOrder = async(idOrder, idUser) => {
    try
    {
        return await ordersModel.findOneAndUpdate(idOrder, {user : idUser}).exec();
    }
    catch(err)
    {
        return null;
    }
}

//Update Order
const updateOrder = async(order) => {
    try
    {
        let idOrder = order.idOrder;
        let queryUpdate = {
            order_name : order.order_name,
            from : order.from,
            to : order.to,
            price : order.price,
            price_ship : order.price_ship,
            longtitude_from : order.longtitude_from,
            latitude_from : order.latitude_from,
            longtitude_to : order.longtitude_to,
            latitude_to : order.latitude_to
        }

        return await ordersModel.findOneAndUpdate(idOrder, queryUpdate).exec();
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
            let result = await ordersModel.find({}).populate({
                path: 'user',
                model: userModel 
            }).sort({createAt: 'desc'}).exec();

            // return await result.forEach(async(i, idx, array) => {
            //     let date = moment(i.createdAt);
            //     i.createAt = date.tz('Asia/Ho_Chi_Minh').format('dd/MM/yyyy');
            // });

            return result;
        }
        else
        {
            return await ordersModel.find({user : idUser}).populate({
                path: 'user',
                model: userModel 
            }).sort({createAt: 'desc'}).exec();
        }
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
};

const deleteOrder = async(idOrder, status) => {
    try
    {
        if(status !== 0)
        {
            return config.KHONG_THE_XOA_DON_HANG;
        }
        else
        {
            await ordersModel.findOneAndUpdate(idOrder, {status : -1}).exec();
            return config.THANH_CONG;
        }
    }
    catch(err)
    {
        console.log(err);
        return config.KHONG_THANH_CONG;
    }
}

module.exports = {
    selectOrderNew, updateStatusOrder, selectAllOrder, deleteOrder, updateUserInOrder, createOrder, selectOrderById, updateOrder
}