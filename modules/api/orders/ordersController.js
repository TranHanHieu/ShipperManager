const express = require('express');
const Router = express.Router();
const ordersModel = require('../orders/ordersModel');
const orderHistoryModel = require('../ship_history/ship_historyModel');
const order_userModel = require('../order_user/order_userModel');
const config = require('../../../configString.json');
const Utils = require('../../../utils/Utils');

//Lấy danh sách đơn hàng mới.
Router.get('/', async(req, res) => {
    try
    {
        if(!Utils.verifyLogin(req.query.idlogin, req.headers['token']))
        {
            res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        }
        else
        {
            let result = await ordersModel.selectOrderNew({});
            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
            else 
                res.send({ status : true, msg : config.THANH_CONG, data : result});
        }
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
    }
});

//Lấy đơn hàng theo ID
Router.get('/select', async(req, res) => {
    try
    {
        // if(!Utils.verifyLogin(req.query.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let result = await ordersModel.selectOrderById(req.query.idOrder);
            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
            else 
                res.send({ status : true, msg : config.THANH_CONG, data : result});
        //}
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
    }
});

//Nhận đơn hàng.
Router.post('/receive', async(req, res) => {
    try
    {
        //Bỏ token làm cho nhanh
        // if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let order_user = {
                order : req.body.order,
                user : req.body.user
            }

            let result = await ordersModel.receiveOrder(order_user, 1, 0, 0, "");

            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : config.THANH_CONG});
        //}
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
});

//bắt đầu giao hàng.
Router.post('/start', async(req, res) => {
    try
    {
        if(typeof req.body.longtitude == "undefined" || req.body.longtitude === 0)
        {
            res.send({status : false, msg : config.CO_LOI_XAY_RA});
        }

        // if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let order_user = {
                order : req.body.order,
                user : req.body.idlogin
            }

            let result = await ordersModel.receiveOrder(order_user, 2, req.body.longtitude, req.body.latitude, req.body.address);

            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : config.THANH_CONG});
        //}
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
});

//Đang giao hàng
Router.post('/shipping', async(req, res) => {
    try
    {
        if(typeof req.body.longtitude == "undefined" || req.body.longtitude === 0)
        {
            res.send({status : false, msg : config.CO_LOI_XAY_RA});
        }

        // if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let history = req.body.listHistory;

            for(i = 0; i < history.length; i++) { 
                let order_user = {
                    order : history[i].order,
                    user : null
                }

                await ordersModel.receiveOrder(order_user, 2, history[i].longtitude, history[i].latitude, history[i].address);
            }

            res.send({status : true, msg : config.THANH_CONG});
    }
    catch(err)
    {
        console.log(err);
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
});

//Hoàn thành đơn hàng.
Router.post('/complete', async(req, res) => {
    try
    {
        if(typeof req.body.longtitude == "undefined" || req.body.longtitude === 0)
        {
            res.send({status : false, msg : config.CO_LOI_XAY_RA});
        }
        
        // if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let order_user = {
                order : req.body.order,
                user : req.body.idlogin
            }

            await ordersModel.receiveOrder(order_user, 3, 0, 0, "");

            res.send({ status : true, msg : config.THANH_CONG});
        //}
    }
    catch(err)
    {
        console.log(err);
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
});

//Lấy danh sách đơn hàng theo user admin sẽ xem đc hết
Router.get('/all', async(req, res) => {
    try
    {
        // if(!Utils.verifyLogin(req.query.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let result = await ordersModel.selectAllOrder(req.query.idlogin, req.query.isadmin);
            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
            else 
                res.send({ status : true, msg : config.THANH_CONG, data : result});
        //}
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
    }
});

//Link Xóa đơn hàng
Router.get('/deleteOrder', async(req, res) => {
    try
    {
        // if(!Utils.verifyLogin(req.query.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let result = await ordersModel.deleteOrder(req.query.idOrder, parseInt(req.query.status));
            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : result});
        //}
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
});

//Thêm đơn hàng
Router.post('/addOrder', async(req, res)=> {
    try
    {
        let newOrder = {
            order_name : req.body.order_name,
            from : req.body.from,
            to : req.body.to,
            price : req.body.price,
            price_ship : req.body.price_ship,
            longtitude_from : req.body.longtitude_from,
            latitude_from : req.body.latitude_from,
            longtitude_to : req.body.longtitude_to,
            latitude_to : req.body.latitude_to
        };
    
        let result = await ordersModel.createOrder(newOrder);
        if(result === null)
            res.send({status : false, msg : config.CO_LOI_XAY_RA});
        else 
            res.send({ status : true, msg : config.THANH_CONG});
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
    
});

//Sửa đơn hàng
Router.put('/editOrder', async(req, res)=> {
    try
    {
        let order = {
            idOrder : req.body.idOrder,
            order_name : req.body.order_name,
            from : req.body.from,
            to : req.body.to,
            price : req.body.price,
            price_ship : req.body.price_ship,
            longtitude_from : req.body.longtitude_from,
            latitude_from : req.body.latitude_from,
            longtitude_to : req.body.longtitude_to,
            latitude_to : req.body.latitude_to
        };
    
        let result = await ordersModel.updateOrder(order);
        if(result === null)
            res.send({status : false, msg : config.CO_LOI_XAY_RA});
        else 
            res.send({ status : true, msg : config.THANH_CONG});
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
    
});

//Xem lịch sử
Router.get('/history', async(req, res) => {
    try
    {
        // if(!Utils.verifyLogin(req.query.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let result = await orderHistoryModel.selectHistory(req.query.idOrder);
            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
            else 
                res.send({ status : true, msg : config.THANH_CONG, data : result});
        //}
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA, data : null});
    }
});

//Xóa lịch sử đơn hàng
Router.delete('/deleteHistory', async(req, res) => {
    try
    {
        // if(!Utils.verifyLogin(req.query.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
            let result = await orderHistoryModel.deleteHistory(req.query.idOrder);
            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : config.THANH_CONG});
        //}
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
});

module.exports = Router;