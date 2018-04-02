const express = require('express');
const Router = express.Router();
const usersModel = require('./usersModel');
const config = require('../../../configString.json');
const Utils = require('../../../utils/Utils');
let moment = require('moment')

//Tạo tài khoản mới mặc định là tài khoản nhân viên
Router.post('/', async (req, res) => {
    try {
        let newUser = {
            // idlogin : req.body.idlogin,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            avatar: req.body.avatar,
            tokenfirebase: req.body.tokenfirebase,
            fullname: req.body.fullname,
            dateofbirth: req.body.dateofbirth,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            acc: req.body.acc,
            trangthai: req.body.trangthai,
            mamautrangthai: req.body.mamautrangthai,
            status: true,
            sodienthoai: req.body.sodienthoai,
            group: req.body.group
        };

        // if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
        let doc = await usersModel.createUser(newUser);
        if (doc === null) {
            res.send({status: false, msg: config.KHONG_THANH_CONG});
        } else {
            res.send({status: true, msg: config.THANH_CONG});

        }
        //}
    }
    catch (err) {
        res.send({status: false, msg: config.CO_LOI_XAY_RA});
    }
});
Router.post('/historylocation', async (req, res) => {
    try {
        let newlocation = {
            date:'',
            longtitude: req.body.longtitude,
            latitude: req.body.latitude,
            acc: req.body.acc,
        };

        // if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {

        usersModel.addHistoryLocationUser(req.body.idUser,newlocation,(err,doc)=>{
            if (err) {
                // console.log(err)
                res.send({status: false, msg: config.KHONG_THANH_CONG});
            } else {
                res.send({status: true, msg: config.THANH_CONG,data:doc});

            }

        });
        //}
    }
    catch (err) {
        res.send({status: false, msg: config.CO_LOI_XAY_RA});
    }
});

Router.put('/', (req, res) => {
    let newUser = {
            // idlogin: req.body.idlogin,
            _id: req.body._id,
            // password: req.body.password,
            email: req.body.email,
            avatar: req.body.avatar,
            // tokenfirebase: req.body.tokenfirebase,
            fullname: req.body.fullname,
            dateofbirth: req.body.dateofbirth,
            group: req.body.group
        };
    usersModel.updateUser(newUser, (err, doc) => {
        if (err) {
            res.send(err.errmsg);
        } else {
            res.send(doc);
        }
    });
});

//Chỉnh sửa thông tin tài khoản
// Router.put('/', async (req, res) => {
//     try {
//         let newUser = {
//             // idlogin: req.body.idlogin,
//             id: req.body._id,
//             password: req.body.password,
//             email: req.body.email,
//             avatar: req.body.avatar,
//             tokenfirebase: req.body.tokenfirebase,
//             fullname: req.body.fullname,
//             dateofbirth: moment(req.body.dateofbirth).format('DD/MM/YYYY'),
//             group: req.body.group
//         };
//         // if (!Utils.verifyLogin(req.body.idlogin, req.headers['token'])) {
//         //     res.send({status: false, msg: config.MA_TOKEN_KHONG_DUNG});
//         // }
//         // else {
//             let doc = await usersModel.updateUser(newUser);
//             if (doc === null) {
//                 res.send({status: false, msg: config.KHONG_THANH_CONG});
//             } else {
//                 res.send({status: true, msg: config.THANH_CONG});
//             }
//         // }
//     }
//     catch (err) {
//         res.send({status: false, msg: config.CO_LOI_XAY_RA});
//     }
// });

//API Đăng nhập cho app vào web

Router.post('/login', async (req, res) => {
    try {
        let user = {
            username: req.body.username,
            password: req.body.password,
            tokenfirebase: req.body.tokenfirebase
        }

        let doc = await usersModel.selectUser(user);
        // let doc = { _id: '5ab8aabbcdfc930c95b70ccb',
        //     username: 'hieuth',
        //     password: 'ngon',
        //     status: true,
        //     group:
        //         { _id: '5a6fe111734d1d63031a767a',
        //             groupname: 'Chủ cửa hàng',
        //             isadmin: true },
        //     createdAt: '2018-03-26T08:09:31.532Z',
        // updatedAt: '2018-03-26T08:09:31.532Z',
        // __v: 0 }

        if (doc === null) {

            res.send({status: false, msg: config.TEN_TK_MK_KHONG_DUNG, data: null, token: ""});
            // res.redirect('/')

        } else {
            console.log('ooo' + doc);

            let token = Utils.getToken(doc._id);
            let update = await usersModel.updateTokenFirebaseUser(doc._id, user.tokenfirebase);
            req.session.token = doc._id;
            req.session.save(err => {
                console.log("errr", err)
            });

            res.send({status: true, msg: config.THANH_CONG, data: doc, token: token});
            // res.redirect('/',{user:doc})

        }
    }
    catch (err) {
        console.log(err);
        res.send({status: false, msg: config.CO_LOI_XAY_RA, data: null, token: ""});
    }
});

//API Logout cho App
Router.get('/logout', async (req, res) => {
    try {
        let id = req.query.id;
        if (!Utils.verifyLogin(req.query.id, req.headers['token'])) {
            res.send({status: false, msg: config.MA_TOKEN_KHONG_DUNG});
        }
        else {
            let update = await usersModel.updateTokenFirebaseUser(id, "");
            if (update === null) {
                res.send({status: false, msg: config.KHONG_THANH_CONG});
            } else {
                res.send({status: true, msg: config.THANH_CONG});
            }
        }
    }
    catch (err) {
        console.log(err);
        res.send({status: false, msg: config.CO_LOI_XAY_RA});
    }
});

//Link lấy danh sách nhân viên
Router.get('/', async (req, res) => {
    try {
        let result = await usersModel.selectAllUser();
        if (result === null) {
            res.send({status: false, msg: config.KHONG_THANH_CONG, data: null});
        } else {
            res.send({status: true, msg: config.THANH_CONG, data: result});
        }
    }
    catch (err) {
        console.log(err);
        res.send({status: false, msg: config.CO_LOI_XAY_RA, data: null});
    }
});
Router.get('/:id', async (req, res) => {
    try {
        usersModel.getUserById(req.params.id,(err,user)=>{
            if (err) {
                res.send({status: false, msg: config.KHONG_THANH_CONG, data: null});
            } else {
                res.send({status: true, msg: config.THANH_CONG, data: user});
            }
        });
    }
    catch (err) {
        console.log(err);
        res.send({status: false, msg: config.CO_LOI_XAY_RA, data: null});
    }
});
Router.get('/location/history', (req, res) => {
    usersModel.getHistoryLocationUserByDate(req.query.id, req.query.date, (err, locations) => {
        if (err) {
            res.send({status: false, msg: config.KHONG_THANH_CONG, data: []});
        } else {
            console.log('location',locations)
            res.send({status: true, msg: config.THANH_CONG, data: locations});
        }
    });
});


Router.get('/count/:trangthai', (req, res) => {
    usersModel.getAllUserByTrangThai(req.params.trangthai, (err, users) => {
        if (err) {
            res.send({status: false, msg: config.KHONG_THANH_CONG, data: 0});
        } else {
            res.send({status: true, msg: config.THANH_CONG, data: users.length});
        }
    });
});
//Đổi mật khẩu tài khoản
Router.post('/changepassword', async (req, res) => {
    try {
        let user = {
            username: req.body.username,
            password: req.body.password,
            newpassword: req.body.newpassword
        }

        // if(!Utils.verifyLogin(req.body.idlogin, req.headers['token']))
        // {
        //     res.send({status : false, msg : config.MA_TOKEN_KHONG_DUNG});
        // }
        // else
        // {
        let result = await usersModel.changePassword(user);
        if (result === 0)
            res.send({status: false, msg: config.TEN_TK_HOAC_MK_SAI});
        else if (result === -1)
            res.send({status: false, msg: config.CO_LOI_XAY_RA});
        else
            res.send({status: true, msg: config.THANH_CONG});
        // }
    }
    catch (err) {
        console.log(err);
        res.send({status: false, msg: config.CO_LOI_XAY_RA});
    }
});

module.exports = Router;