const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const order_userSchema = new Schema(
    {
        order : {type : ObjectId, require : true},
        user : {type : ObjectId, require : true}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);


module.exports = order_userSchema;