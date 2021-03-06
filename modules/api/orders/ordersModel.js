const mongoose = require('mongoose');
const ordersSchema = require('./ordersSchema');
let ordersModel = mongoose.model('orders', ordersSchema, 'orders');
const order_userModel = require('../order_user/order_userModel');
const ship_historyModel = require('../ship_history/ship_historyModel');
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
const getAllOrderByStatus = async ({status}) => {
    try
    {
        return await ordersModel.find({status : status}).exec();
    }
    catch(err)
    {
        return null;
    }
}

const selectOrderById = async (id) => {
    try
    {
        return await ordersModel.findOne({_id : id}).populate({
            path : 'user',
            model: userModel
        }).exec();
    }
    catch(err)
    {
        return null;
    }
}

const updateStatusOrder = async(idorder, status) => {
    try
    {
        ordersModel.findById(idorder).exec((err,order)=>{
            console.log(err);
            if(order){
                order.status = status;
                order.save(err=>{
                    console.log(err);
                })
            }
        });

        return 1;
    }
    catch(err)
    {
        return null;
    }
}

const updateUserInOrder = async(idOrder, idUser) => {
    try
    {
        ordersModel.findById(idOrder).exec((err,order)=>{
            console.log(err);
            if(order){
                order.user = idUser;
                order.save(err=>{
                    console.log(err);
                })
            }
        });

        return 1;
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

        ordersModel.findById(idOrder).exec((err, ord)=>{
            if(ord){
                ord.order_name = order.order_name;
                ord.from = order.from;
                ord.to = order.to;
                ord.price = order.price;
                ord.price_ship = order.price_ship;
                ord.longtitude_from = order.longtitude_from;
                ord.latitude_from = order.latitude_from;
                ord.longtitude_to = order.longtitude_to;
                ord.latitude_to = order.latitude_to;

                ord.save(err=>{
                    console.log(err);
                })
            }
        });
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
            }).sort('-createAt').exec();

            return result;
        }
        else
        {
            return await ordersModel.find({$or: [ {status : 0}, {user : idUser}]}).populate({
                path: 'user',
                model: userModel
            }).sort('-createAt').exec();
        }
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
};

const deleteOrder = async(idOrder, status) => {
    console.log(idOrder);
    try
    {
        if(status !== 0)
        {
            return config.KHONG_THE_XOA_DON_HANG;
        }
        else
        {
            ordersModel.findById(idOrder).exec((err,order)=>{
                if(order){
                    order.status=-1;
                    order.save(err=>{
                        console.log(err);
                    })
                }

            })
            return config.THANH_CONG;
        }
    }
    catch(err)
    {
        console.log(err);
        return config.KHONG_THANH_CONG;
    }
}

const receiveOrder = async (order_user, status, longtitude, latitude, address) => {
    try
    {
        var history = {
            order : order_user.order,
            address : address,
            longtitude : longtitude,
            latitude : latitude
        }

        //Nhận đơn
        if(status === 1)
        {
            let result = await updateUserInOrder(order_user.order, order_user.user);
            if(result != null && result != {})
            {
                return await updateStatusOrder(order_user.order, 1);
            }
        }
        else if(status === 2)
        {
            //Thêm tọa độ tại điểm nhận đơn hoặc kết thúc

            await ship_historyModel.insertHistory(history);

            //Update trạng thái thành 2, 3
            return await updateStatusOrder(order_user.order, status);
        }
        else if(status === 4)
        {
            return await ship_historyModel.insertHistory(history);
        }
        else if (status === 3)
        {
            return await updateStatusOrder(order_user.order, 3);
        }
        else
        {
            //đơn hàng Bị hủy
            return await updateStatusOrder(order_user.order, -1);
        }
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
}

const saveListHistory = async(history) => {
    for(i = 0; i < history.length; i++) {
        let order_user = {
            order : history[i].order,
            user : null
        }

        await receiveOrder(order_user, 2, history[i].longtitude, history[i].latitude, history[i].address);
    }

    return 1;
}

const dataChartOrder = async() => {
    let d = new Date();
    let month = d.getMonth() +  1;
    let year = d.getFullYear();
    try
    {
        return await ordersModel.aggregate(
            [
                {
                    $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: "$_id.day"
                        },
                        count: { $sum: "$count" },
                        //statuses: { $push: { key: { $concat: ["status", {$substr:["$_id.status", 0, -1]}] }, value: "$count" } } 
                        statuses: { $push: { key: '$_id.status', value: "$count" } }   
                    }
                },
                {
                    $match : {
                        "_id.month" : month, "_id.year" : year
                    }
                },
                {
                    $sort : {
                        "_id.day" : 1
                    }
                }
            ]
        ).exec();
    }
    catch(err)
    {
        console.log(err);
        return [];
    }
}

const dataChartOrderRevenue = async() => {
    let d = new Date();
    let year = d.getFullYear();
    let result = [];

    for (i = 1; i <= 12; i++) { 
        let element = await ordersModel.aggregate(
            [
                {
                    $group: {
                      _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        status : "$status"
                      },
                      total: {$sum : "$price"}
                    }
                },
                {
                    $match : {
                        "_id.month" : i, "_id.year" : year
                    }
                },
                { 
                    $sort : {
                        "_id.month" : 1
                    }
                }
            ]
        ).exec();

        if(element.length != 0)
            result.push({
                month : ((element[0]._id.month < 10) ? ("0" + element[0]._id.month) : element[0]._id.month) + "/" + year,
                total : element[0].total
            });
        else
            result.push({
                month : ((i < 10) ? ("0" + i) : i) + "/" + year,
                total : 0
            });
    }

    return result;
}

module.exports = {
    selectOrderNew, updateStatusOrder, selectAllOrder, deleteOrder,
    updateUserInOrder, createOrder, selectOrderById, updateOrder, receiveOrder, saveListHistory, getAllOrderByStatus, dataChartOrder, dataChartOrderRevenue
}