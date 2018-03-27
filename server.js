const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const configPort = process.env.PORT || 3000;
const config = require('./config.json');
const handlebars = require('express-handlebars');
const cache = require('cache-control');

const userApi = require('./modules/api/users/usersController');
const groupApi = require('./modules/api/groups/groupsController');
const orderApi = require('./modules/api/orders/ordersController');

var app = express();

app.use(bodyParser.json({ extended : true}));
app.use(bodyParser.urlencoded({ extended : true}));
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
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

mongoose.connect(config.connectionString, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connect to db success');
  }
})
app.get('/',(req,res)=>{
    res.render('login',{layout:false});

})
app.get('/employeeList',(req,res)=>{
    res.render('employeeList');

})
app.get('/orderList',(req,res)=>{
    res.render('orderList');

})
app.get('/home', (req, res) => {
    res.render('home');
    // res.sendFile(__dirname + '/public/home.html')

});

app.listen(configPort , () => {
  console.log(`App listen on ${configPort}`);
})