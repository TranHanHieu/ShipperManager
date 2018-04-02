const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const config = require('../../../configString')
const moment = require('moment')
const location = new Schema(
    {
        longtitude : {type : Number, require : true},
        latitude : {type : Number, require : true},
        acc : {type : Number, require : true}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);
const historyLocationSchema = new Schema(
    {
        iduser:{type:String},
        longtitude : {type : Number, require : true},
        latitude : {type : Number, require : true},
        acc : {type : Number, require : true},
        date: {type : String, default:moment(new Date()).format('YYYY-MM-DD')}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);
module.exports = historyLocationSchema;