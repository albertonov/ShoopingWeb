/**
* app.js
*/
// Import express module
var express = require('express');

// Import path module
var path = require('path');

// Import logger module
var logger = require('morgan');

var model = require('./model/model');
// Instantiate the express middleware
var app = express();

app.use(express.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
const { Console } = require('console');
app.use(cookieParser());
// Load logger module
app.use(logger('dev'));

//Set public folder to publish static content
app.use(express.static(path.join(__dirname ,'public')));


app.get('/api/products', function (req, res, next) {
  console.log("PRODUCTS")
  return res.json(model.products);
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
  console.log(req.body)
  var user = model.signin(req.body.email, req.body.password)
  if (user) {
    res.cookie('userid', user._id);
    return res.json(user);
  }
  else return res.status(401).send({ message: 'Invalid email or password' });
});


app.get('/api/cart/qty', function (req, res, next) {
  var userid = req.cookies.userid;
  if (!userid) return res.status(401).send({ message: 'User has not signed in' });
  var userCartQty = model.getUserCartQty(userid);
  if (userCartQty) return res.json(userCartQty);
  else return res.status(500).send({ message: 'Cannot retrieve user cart quantity' });
  });

  app.post('/api/cart/items/product/:id', 
  function (req, res, next) {
    console.log("buy product")
    var pid = req.params.id;
    var uid = req.cookies.userid;
    
    var cart = model.buy(uid, pid);
    if (cart) { return res.json(cart);}
    else return res.status(401).send(
      { message: 'User or Product not found' });
  });


  app.get('/api/cart', function (req, res, next) {
    console.log("CARTTTTTT")
    var uid = req.cookies.userid;
    var cart = model.getCartByUserId(uid);
    console.log("CARTTTTT2222")
    if (cart) { return res.json(cart); }
    else return res.status(401).send({ message: 'User shopping cart not found' });
    });



app.delete('/api/cart/items/product/:id/one', 
function (req, res, next) {
  console.log("removing")
  var pid = req.params.id;
  var uid = req.cookies.userid;
  var cart = Model.removeOne(uid, pid);
  if (cart) { return res.json(cart); }
  else return res.status(401).send(
    { message: 'User or Product not found' });
});




app.get(/\/.*/, function (req, res) {
    res.sendFile(path.join(__dirname ,'/public/index.html'));
  });

