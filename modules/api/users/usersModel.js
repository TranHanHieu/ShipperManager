const mongoose = require('mongoose');
const userSchema = require('./usersSchema');
let usersModel = mongoose.model('users', userSchema);

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

const updateUser = async(user) => {
    try
    {
        var id = user._id;
        var queryUpdate = {
            email : user.email,
            fullname : user.fullname,
            dateofbirth : user.dateofbirth,
            tokenfirebase : user.tokenfirebase,
            avatar : user.avatar,
            password : user.password,
            email : user.email,
            group : user.group
        }
    
        return await usersModel.findOneAndUpdate(id, queryUpdate).exec();
    }
    catch(err)
    {
        return null;
    }
}

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
        console.log(err);
        return null;
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
module.exports = {
    createUser, updateUser, selectUser, updateTokenFirebaseUser, changePassword, selectUserForScheme
}