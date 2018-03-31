const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const config = require('../../../configString')
const locationSchema = new Schema(
    {
        date:{type:String,require:true},
        longtitude : {type : Number, require : true},
        latitude : {type : Number, require : true},
        acc : {type : Number, require : true}
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);


const usersSchema = new Schema(
    {
        username : {type : String, require : true},
        password : {type : String, require : true},
        fullname : {type : String, require : true},
        dateofbirth : {type : String},
        tokenfirebase : {type: String},
        group : {type : ObjectId},
        avatar : {type: String},
        email : {type : String},
        longitude: {type:Number,default:0.0},
        latitude: {type:Number,default:0.0},
        acc: {type:Number,default:0.0},
        sodienthoai:{type:String,default:'01669886430'},
        trangthai:{type:String,default:config.MAT_TIN_HIEU},
        mamautrangthai:{type:String,default:'red'},
        historylocations:{
            type:[locationSchema],
            default:[]
        },
        status : {type : Boolean}//false vô hiệu hóa tài khoản
    }, {timestamps : {createAt : 'created_at', updateAt : 'updated_at'}}
);

let usersModel = mongoose.model('users', usersSchema);

// usersSchema.pre('save', function(next) {
//     let user = this;
//     usersModel.find({username : user.username}, function (err, docs) {
//         if (!docs.length){
//             next();
//         }else{
//             //console.log('user exists: ',user.username);
//             next(new Error("User exists!"));
//         }
//     });
// });


module.exports = usersSchema;