const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const secretKey = 'your_jwt_secret';
const bcryptjs = require('bcryptjs');
const User = require('./model/user');
const jwt = require('jsonwebtoken'); 

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
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  function (email, password, cb) {
    return User.findOne({ email }).select('email password name surname')
      .then(function (user) {
        if (!user) {
          return cb({ message: 'Email not found' }, false);
        }
        if (!bcryptjs.compareSync(password, user.password)) {
          return cb({ message: 'Incorrect password' }, false);
        }
        return cb(null, user);
      })
      .catch(function (err) { console.error('ERR STGY', err); cb(err) });
  }
));

passport.use(new JWTStrategy({ jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: secretKey },
  function (jwtPayload, cb) {
    return cb(null, { _id: jwtPayload.id });
  }
));
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
  return passport.authenticate('local', { session: false },
    function (err, user, info) {
      if (err || !user) { console.error(err, user); return res.status(401).json(err); }
      return req.logIn(user, { session: false }, function (err) {
        if (err) { res.status(401).send(err); }
        useridFromToken(req, res);
        return res.json(user);
      });
    })(req, res);
});

function useridFromToken(req, res) {
  if (req.user) {
    res.cookie('token', jwt.sign({ id: req.user._id }, secretKey, { expiresIn: 20 }));
    return req.user._id;
  } else {
    res.cookie.removeOne('token');
    return null;
  }
}

app.post('/api/users/signup', function (req, res, next) {
  console.log(req.body.birth)
  return model.signup(req.body.name, req.body.surname, req.body.address, req.body.birth, req.body.email, req.body.password)
    .then(function (user) {
      if (user) return res.json(user);
      else return res.status(401).send({ message: 'Invalid email' });
    })
});


app.get('/api/cart', passport.authenticate('jwt', { session: false }), function (req, res, next) {

  var uid = useridFromToken(req, res);;
  return model.getCartByUserId(uid)
    .then(function (cart) {
      if (cart) { return res.json(cart); }
      else return res.status(401).send({ message: 'User shopping cart not found' });
    })

});

app.delete('/api/cart/items/product/:id/one',
  function (req, res, next) {

    var pid = req.params.id;
    var uid = req.cookies.userid;
    return model.removeOne(uid, pid)
      .then(function (result) {
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
      .then(function (result) {
        if (result) { return res.json(result); }
        else return res.status(401).send(
          { message: 'User or Product not found' });
      })
  });




  app.get('/api/cart/qty', passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    console.log(req.user)
    var userid = useridFromToken(req, res);
    if (!userid) return res.status(401).send({ message: 'User has not signed in' });
    else
      return model.getUserCartQty(userid)
        .then(function (userCartQty) {
          if (userCartQty) return res.json(userCartQty);
          else return res.status(500).send({ message: 'Cannot retrieve user cart quantity' });
        })
        .catch(function (error) {
          return res.status(500).send({ message: 'Cannot retrieve user cart quantity' })
        })
  });

app.post('/api/cart/items/product/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var pid = req.params.id;
  var uid = useridFromToken(req, res);
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
      .then(function (order) {

        return model.resetCart(uid)
          .then(function (user) {

            return model.getUserByIdWithCart(uid)
              .then(function (user) {
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
      if (profile) { console.log(profile); return res.json(profile); }
      else return res.status(401).send({ message: 'User  not found' });
    })

});

app.get('/api/orders/id/:oid', function (req, res, next) {
  var oid = req.params.oid;
  console.log(oid)
  return model.getOrder(oid, req.cookies.userid)
    .then(function (order) {
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

