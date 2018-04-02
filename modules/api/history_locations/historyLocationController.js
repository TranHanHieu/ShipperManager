const express = require('express');
const Router = express.Router();
const historyLocationModel = require('../history_locations/historyLocationModel');
const config = require('../../../configString.json');
const Utils = require('../../../utils/Utils');

Router.post('/', async(req,res)=>{
    let location = {
        iduser : req.body.iduser,
        longtitude : req.body.longtitude,
        latitude : req.body.latitude,
        acc: req.body.acc
    }


    let result = await historyLocationModel.createOrUpdateLocation(location);
    console.log(result)
    if(result === null)
        res.send({status : false, msg : config.CO_LOI_XAY_RA, data:[]});
    else
        res.send({ status : true, msg : config.THANH_CONG, data:result});

})
Router.get('/', async(req,res)=>{
    let iduser = req.query.id

    let result = await historyLocationModel.getHistoryLocationByUser(iduser, req.query.date);
    console.log(result)
    if(result === null)
        res.send({status : false, msg : config.CO_LOI_XAY_RA, data:[]});
    else
        res.send({ status : true, msg : config.THANH_CONG, data:result});

})
module.exports = Router;