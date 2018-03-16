const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const ship_historySchema = new Schema(
    {
        order : {type : ObjectId, require : true},
        longtitude : {type : Number, require : true},
        latitude : {type : Number, require : true}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);


module.exports = ship_historySchema;