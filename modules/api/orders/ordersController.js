const express = require('express');
const Router = express.Router();
const ordersModel = require('../orders/ordersModel');
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

//Nhận đơn hàng.
Router.post('/receive', async(req, res) => {
    try
    {
        if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        {
            res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        }
        else
        {
            let order_user = {
                order : req.body.order,
                user : req.body.idlogin
            }

            let result = await order_userModel.receiveOrder(order_user, 1, 0, 0);

            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : config.THANH_CONG});
        }
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

        if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        {
            res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        }
        else
        {
            let order_user = {
                order : req.body.order,
                user : req.body.idlogin
            }

            let result = await order_userModel.receiveOrder(order_user, 2, req.body.longtitude, req.body.latitude);

            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : config.THANH_CONG});
        }
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

        if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        {
            res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        }
        else
        {
            let order_user = {
                order : req.body.order,
                user : req.body.idlogin
            }

            let result = await order_userModel.receiveOrder(order_user, 4, req.body.longtitude, req.body.latitude);

            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : config.THANH_CONG});
        }
    }
    catch(err)
    {
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
        
        if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        {
            res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        }
        else
        {
            let order_user = {
                order : req.body.order,
                user : req.body.idlogin
            }

            let result = await order_userModel.receiveOrder(order_user, 3, req.body.longtitude, req.body.latitude);

            if(result === null)
                res.send({status : false, msg : config.CO_LOI_XAY_RA});
            else 
                res.send({ status : true, msg : config.THANH_CONG});
        }
    }
    catch(err)
    {
        res.send({status : false, msg : config.CO_LOI_XAY_RA});
    }
});



module.exports = Router;