const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const configPort = process.env.PORT || 3001;
const config = require('./config.json');
const handlebars = require('express-handlebars');
const cache = require('cache-control');
const session = require('express-session');

const userApi = require('./modules/api/users/usersController');
const groupApi = require('./modules/api/groups/groupsController');
const orderApi = require('./modules/api/orders/ordersController');
const {getAllUser,deleteEmployee,getUserById} = require('./modules/api/users/usersModel')
const {getAllGroup} = require('./modules/api/groups/groupsModel')
var app = express();

app.use(session({
    secret: '%^&@%&#@!',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(bodyParser.json({ extended : true}));
app.use(bodyParser.urlencoded({ extended : true}));
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: {
        getBGColor: (fullname) => {
            const userName = fullname || '';

            let sumChars = 0;
            for (let i = 0; i < userName.length; i += 1) {
                sumChars += userName.charCodeAt(i);
            }
            let colors = {
                carrot: '#e67e22',
                emerald: '#2ecc71',
                peterRiver: '#3498db',
                wisteria: '#8e44ad',
                alizarin: '#e74c3c',
                turquoise: '#1abc9c',
                midnightBlue: '#2c3e50'
            };
            colors = Object.values(colors);
            return colors[sumChars % colors.length];
        },
        getSortName: (fullname) => {
            const userName = fullname || '';
            userName.trim();
            let name = userName.toUpperCase().split(' ');
            let avatarName = "";
            if (name.length === 1) {
                avatarName = ` ${name[0].charAt(0)}`;
            } else if (name.length > 1) {
                name = name.filter((item) => {
                    return item;
                })
                avatarName = `${name[0].charAt(0)}${name[name.length - 1].charAt(0)}`;
            }
            return avatarName;
        },
        formatMoney: (money) => {
            let result = (+money).toFixed(0).replace(/./g, function (c, i, a) {
                return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
            });
            return `${result} đ`

        }
    }
}));
app.set('view engine', 'handlebars');

app.use('/api/user', userApi);
app.use('/api/group', groupApi);
app.use('/api/order', orderApi);

// app.use(express.static(__dirname + '/public'));

app.use(express.static(path.join(__dirname, "/public"), {
    redirect: false,
    etag: false
}));

app.use(cache({
    '/**': 0 // Default to caching all items for 500
}));
app.use(function (req, res, next) {
    req.headers['if-none-match'] = '';
    req.headers['if-modified-since'] = '';
    if (!req.session.token && req.url !== '/' && req.url.indexOf(".") === -1 && req.url.indexOf("/api/") === -1) {
        res.redirect('/')
    } else {
        next();
    }
});
mongoose.connect(config.connectionString, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connect to db success');
  }
})
app.get('/',(req,res)=>{
    if (req.session.token) {
        res.render('home')
    }else {
        res.render('login', {layout: false});
    }

})
app.get('/logout', (req, res) => {
    req.session.token = null;
    res.redirect('/');
})
app.get('/changepass', (req, res) => {
    res.render('changePass');
})

app.get('/employeeList',(req,res)=>{
    getAllUser((users,err)=>{
        console.log('lllllllll',users)
        res.render('employeeList',{users});

    })

})
// Xóa nhân viên
app.get('/delete', (req, res) => {
    let id = req.query.id;
    deleteEmployee(id).then(() => {
        res.redirect(`/employeeList`)
    })
});
app.get('/edit', (req, res) => {
    let id = req.query.id;
    getAllGroup((groups,err)=> {
        getUserById(id, (user, err) => {
            res.render('editEmployee', {user,groups})
        })
    })
});
app.get('/addEmployee',(req,res)=>{
    getAllGroup((groups,err)=>{
        console.log(groups)
        res.render('addEmployee',{groups});

    })

})
app.get('/orderList',(req,res)=>{
    res.render('orderList');

})

app.get('/addOrder',(req,res)=>{
    res.render('addOrder');

})

app.get('/editOrder',(req,res)=>{
    res.render('editOrder');
})

app.get('/orderDetail',(req,res)=>{
    res.render('orderDetail');
})


app.get('/home', (req, res) => {
    res.render('home');
    // res.sendFile(__dirname + '/public/home.html')

});

app.listen(configPort , () => {
  console.log(`App listen on ${configPort}`);
})