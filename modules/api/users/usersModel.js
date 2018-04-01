const mongoose = require('mongoose');
const userSchema = require('./usersSchema');
let usersModel = mongoose.model('users', userSchema);
let moment = require('moment')

const groupsSchema = require('../groups/groupsSchema');
let groupsModel = mongoose.model('groups', groupsSchema);

const createUser = async(user) => {
    try
    {
        return await usersModel.create(user);
    }
    catch(err)
    {
        return null;
    }
}
const updateUser = (newUser, callback) => {
    usersModel.findById(newUser._id).exec((err, doc) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            doc.set(newUser);
            doc.save((err, doc) => {
                callback(err, doc);
            })
        }
    })
};
// const updateUser = async(user) => {
//     try
//     {
//         var id = user._id;
//         var queryUpdate = {
//             email : user.email,
//             fullname : user.fullname,
//             dateofbirth : user.dateofbirth,
//             tokenfirebase : user.tokenfirebase,
//             avatar : user.avatar,
//             password : user.password,
//             email : user.email,
//             longitude: user.longitude,
//             latitude: user.latitude,
//             acc: user.acc,
//             group : user.group
//         }
//
//         return await usersModel.findOneAndUpdate(id, queryUpdate).exec();
//     }
//     catch(err)
//     {
//         return null;
//     }
// }

const selectUser = async(user) => {
    try
    {
        var queryFind = {
            username : user.username,
            password : user.password,
        }
    
        return await usersModel.findOne(queryFind).populate({
            path: 'group',
            model: groupsModel 
          }).exec();
    }
    catch(err)
    {
        // console.log(err);
        return err;
    }
}

const selectUserForScheme = async(iduser) => {
    try
    {
        return await usersModel.findOne({_id : iduser}).populate({
            path: 'group',
            model: groupsModel 
          }).exec();
    }
    catch(err)
    {
        return null;
    }
}


const updateTokenFirebaseUser = async (iduser, tokenfirebase) => {
    try
    {
       return await usersModel.findOneAndUpdate(iduser, {tokenfirebase : tokenfirebase}).exec();
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
}

const changePassword = async(user) => {
    try
    {
       let userOld = await usersModel.findOne({username : user.username, password : user.password}).exec();
       if(userOld === null || typeof userOld === 'undefined')
       //Sai tài khoản hoặc mật khẩu
            return 0;
       else
        {
            let newUser = await usersModel.findOneAndUpdate({username : user.username,password : user.password}, {password : user.newpassword}).exec();
            if(newUser === null || typeof newUser === 'undefined')
                return 0;
            else 
                return 1;
        }
    }
    catch(err)
    {
        console.log(err);
        return -1;
    }
}

const selectAllUser = async() => {
    try
    {
        return await usersModel.find({status : true}).populate({
            path: 'group',
            model: groupsModel 
          }).exec();
    }
    catch(err)
    {
        return err;
    }
}

const getAllUser = (callback) => {
    usersModel.find({status : true}).populate({
        path: 'group',
        model: groupsModel
    }).exec(function (err, users) {

        callback(users, err);
    });
};
const getHistoryLocationUserByDate = (idUser,date,callback) => {
     usersModel.findOne({_id:idUser,status : true}).exec((err, user) => {
        if(err){
            console.log('Loii roi')
            callback(err)
        }else {
            var data = [];
            var locations = user.historylocations;
            console.log(user)
            if(user.historylocations.length>0) {
                for (let i = 0; i < user.historylocations.length; i++) {
                    console.log(user.historylocations[i].date,date)
                    if (user.historylocations[i].date === date) {
                        data.push(user.historylocations[i])
                    }
                    if (i === locations.length - 1) {
                        callback(err, data);
                    }
                }
            }else {
                callback('404 Notfound', data);
            }
        }
    });
};
const addHistoryLocationUser = (idUser,newLocation,callback) => {
     usersModel.findOne({_id:idUser}).exec((err, user) => {
         console.log(user)
        if(err){
            callback(err)
        }else {
            var locations = user.historylocations;
            locations.push(newLocation);
            user.historylocations.set(locations);
            user.save((err,newUser)=>{
                if(err){
                    callback(err)
                }else {
                    callback(err,newUser)
                }
            })
        }
    });
};

const getUserById = (id,callback) => {
    usersModel.findOne({_id : id}).populate({
        path: 'group',
        model: groupsModel
    }).exec(function (err, user) {

        callback(user, err);
    });
};

const deleteEmployee = async(idUser) => {
    return usersModel.findOneAndUpdate({_id : idUser}, {status : false}).exec();
}

module.exports = {
    createUser, updateUser, selectUser, updateTokenFirebaseUser, changePassword, selectUserForScheme, selectAllUser, getAllUser, deleteEmployee, getUserById, getHistoryLocationUserByDate, addHistoryLocationUser
}