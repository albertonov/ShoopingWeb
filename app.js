/**
* app.js
*/
// Import express module
var express = require('express');

// Import path module
var path = require('path');

// Import logger module
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var model = require('./model/model');

//DB initialization

var mongoose = require('mongoose');

var uri = 'mongodb://localhost/gameshop';
mongoose.Promise = global.Promise;

var db = mongoose.connection;
  db.on('connecting', function () { console.log('Connecting to ', uri); });
  db.on('connected', function () { console.log('Connected to ', uri); });
  db.on('disconnecting', function () { console.log('Disconnecting from ', uri); });
  db.on('disconnected', function () { console.log('Disconnected from ', uri); });
  db.on('error', function (err) { console.error('Error ', err.message); });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })








// Instantiate the express middleware
var app = express();

app.use(express.urlencoded({ extended: true }));
const { Console } = require('console');
const { user, getOrders } = require('./model/model');
const { REPL_MODE_STRICT } = require('repl');
app.use(cookieParser());
// Load logger module
app.use(logger('dev'));

//Set public folder to publish static content
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', function (req, res, next) {
  return model.getProducts()
  .then(function (products) {
    if (products) {
      return res.json(products);
    }
    else return res.status(401).send({ message: 'Cannot get products' });
  })
});

// Adds the / path to the application
app.get('/', function (req, res) {
  // Sends the Hello World string back to the client
  res.send('Hello World!');
});



// Listen to port 3000
app.listen(3000, function () {
  console.log('Launching...');
  console.log('EasyPCy WebApp listening on port 3000!');
});

app.post('/api/users/signin', function (req, res, next) {
  
  return model.signin(req.body.email, req.body.password)
    .then(function (user) {
      if (user) {
        res.cookie('userid', user._id);
        return res.json(user);
      }
      else return res.status(401).send({ message: 'Invalid email or password' });
    })
});


app.post('/api/users/signup', function (req, res, next) {
  console.log(req.body.birth)
  return model.signup(req.body.name, req.body.surname, req.body.address, req.body.birth, req.body.email, req.body.password)
  .then(function (user) {
  if (user) return res.json(user);
  else return res.status(401).send({ message: 'Invalid email' });
  })
  });


  app.get('/api/cart', function (req, res, next) {

    var uid = req.cookies.userid;
    return model.getCartByUserId(uid)
      .then(function(cart){
        if (cart) { return res.json(cart); }
        else return res.status(401).send({ message: 'User shopping cart not found' });
      })

  });

  app.delete('/api/cart/items/product/:id/one',
  function (req, res, next) {

    var pid = req.params.id;
    var uid = req.cookies.userid;
    return model.removeOne(uid, pid)
      .then(function(result){
        if (result) { return res.json(result); }
        else return res.status(401).send(
          { message: 'User or Product not found' });
      })

  });

  app.delete('/api/cart/items/product/:id/all',
  function (req, res, next) {

    var pid = req.params.id;
    var uid = req.cookies.userid;

    return model.removeAll(uid, pid)
      .then(function(result){
        if (result) { return res.json(result); }
        else return res.status(401).send(
          { message: 'User or Product not found' });
      })
  });



  app.get('/api/cart/qty', function (req, res, next) {
    var userid = req.cookies.userid;
    if (!userid) return res.status(401).send({ message: 'User has not signed in' });
    return model.getUserCartQty(userid)
      .then(function (userCartQty) {
        if (userCartQty) return res.json(userCartQty);
        else return res.status(500).send({ message: 'Cannot retrieve user cart quantity' });
      })
  });

  app.post('/api/cart/items/product/:id', function (req, res, next) {
    var pid = req.params.id;
    var uid = req.cookies.userid;
    return model.buy(uid, pid)
      .then(function (cart) {
        if (cart) return res.json(cart);
        else return res.status(401).send({ message: 'User or Product not found' });
      })
  });

app.post('/api/orders',
  function (req, res, next) {

    var date = req.body.date;
    var address = req.body.address;
    var cardNumber = req.body.cardNumber;
    var cardOwner = req.body.cardOwner;
    var uid = req.cookies.userid;
    
    return model.purchase(date, address, cardNumber, cardOwner, uid)
    .then(function (order){
      
      return model.resetCart(uid)
      .then( function(user){
        
        return model.getUserByIdWithCart(uid)
        .then( function(user){
          user.orders.push(order)
          console.log("limpio")
          return user.save()
          .then(function (result) {
            if (result) return res.json(order);
            else return res.status(401).send({ message: 'User or Product not found' });
          })
        })
      })
    }).catch(function (errors) { console.error(errors); return null; })


  });












app.get('/api/orders', function (req, res, next) {
  
  var uid = req.cookies.userid;
  var orders = model.getOrdersByUserId(uid);
  if (orders) { return res.json(orders); }
  else return res.status(401).send({ message: 'User orders not found' });
});


app.get('/api/profile', function (req, res, next) {
  return model.getUserByIdWithOrders(req.cookies.userid)
  .then(function (profile) {
    if (profile) {console.log(profile); return res.json(profile); }
  else return res.status(401).send({ message: 'User  not found' });
  })
  
});

app.get('/api/orders/id/:oid', function (req, res, next) {
  //obtener las orders del usuario; obtener la orden que coincida el number con el ID; delvolver esa order
  var oid = req.params.oid;
  console.log(oid)
  return model.getOrder(oid, req.cookies.userid)
  .then(function (order){
    if (order) {
      console.log(order)
      return res.json(order);
    }
    else return res.status(401).send({ message: 'Order  not found' });
  })

});

app.get(/\/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

