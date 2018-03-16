const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const groupsChema = new Schema(
    {
       groupname : {type : String, require : true},
       isadmin : {type : Boolean, require : true}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);


module.exports = groupsChema;