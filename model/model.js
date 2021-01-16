var User = require('./user');
var Cart = require('./shopping-cart')
var Product = require('./product');
var Order = require('./order');
var Model = {}
Model.order = [{}];
Model.user = null;


Model.getProducts = function () {
  result = Product.find();
  return result;
}

Model.signin = function (email, password) {
  return User.findOne({ email, password });
}

Model.signup = function (name, surname, address, birth, email, password) {
  return User.findOne({ email })
    .then(function (user) {
      if (!user) {
        var cart = new Cart({ items: [], qty: 0, total: 0, subtotal: 0, tax: 0 });
        var user = new User({ email, password, name, surname, birth, address, shoppingCart: cart });
        return cart.save().then(function () { return user.save(); })
      } else return null;
    })
}

Model.signout = function () {
  Model.user = null;
}

Model.purchase = function (date, address, cardNumber, cardOwner, uid) {

  return Promise.all([Model.getUserById(uid), Model.getCartByUserId(uid)])
    .then(function (results) {
      var user = results[0];
      var cart = results[1];
      var number = new Date().getTime();

      var order = new Order({
        'number': number,
        'date': date,
        'cardNumber': cardNumber,
        'cardOwner': cardOwner,
        'user': user,
        'address': address,
        'qty': cart.qty,
        'total': cart.total,
        'subtotal': cart.subtotal,
        'tax': cart.tax,
        'items': cart.items

      })
      return order.save()
    }).catch(function (errors) { console.error(errors); return null; })
}

Model.resetCart = function (uid) {
  return Model.getUserByIdWithCart(uid)
    .then(function (user) {
      user.shoppingCart.items = [];
      user.shoppingCart.qty = 0;
      user.shoppingCart.subtotal = 0;
      user.shoppingCart.tax = 0;
      user.shoppingCart.total = 0;
      return user.shoppingCart.save()
    });
}

Model.getOrders = function (uid) {
  return Model.getUserByIdWithOrders(uid)
    .then(function (userWOrders) {
      return userWOrders.orders;
    })
};

Model.getOrder = function (number, uid) {
  return this.getUserById(uid)
    .then(function (user) {
      console.log(user)
      return Order.findOne({ 'number': number, 'user': user._id })
        .then(function (order) {
          return order;
        })
    })
}

Model.getUserById = function (userid) {
  return User.findById(userid);
}

Model.getUserByIdWithCart = function (userid) {
  return User.findById(userid).populate('shoppingCart');
}

Model.getUserByIdWithOrders = function (uid) {
  return Model.getUserById(uid).populate('orders');;
}

Model.getUserCartQty = function (userid) {
  return User.findById(userid).populate({ path: 'shoppingCart', select: 'qty' })
}

Model.getProductById = function (pid) {
  return Product.findById(pid);
}

Model.buy = function (uid, pid) {
  return Promise.all([Model.getProductById(pid), Model.getUserByIdWithCart(uid)])
    .then(function (results) {
      var product = results[0];
      var user = results[1];
      if (user && product) {
        var item = null;
        for (var i = 0; i < user.shoppingCart.items.length; i++) {
          if (user.shoppingCart.items[i].product == pid) {
            item = user.shoppingCart.items[i];
            user.shoppingCart.items.remove(item);
          }
        }
        if (!item) { item = { qty: 0 }; }
        item.product = product._id;
        item.qty++;
        item.title = product.title;
        item.price = product.price;
        item.total = item.qty * item.price;
        user.shoppingCart.items.push(item);
        Model.updateShoppingCart(user);
        return user.shoppingCart.save()
          .then(function (result) { return result });
      } else return null;
    }).catch(function (errors) { console.error(errors); return null; })
}

Model.updateShoppingCart = function (user) {
  user.shoppingCart.qty = 0;
  user.shoppingCart.subtotal = 0;
  for (var i = 0; i < user.shoppingCart.items.length; i++) {
    user.shoppingCart.qty = user.shoppingCart.qty + user.shoppingCart.items[i].qty;
    user.shoppingCart.subtotal = user.shoppingCart.subtotal + user.shoppingCart.items[i].total;
  }

  user.shoppingCart.tax = user.shoppingCart.subtotal * 0.21;
  user.shoppingCart.total = user.shoppingCart.subtotal + user.shoppingCart.tax;
}


Model.getCartByUserId = function (uid) {
  return this.getUserByIdWithCart(uid)
    .then(function (sc) {
      return sc.shoppingCart;
    });
}

Model.getOrdersByUserId = function (uid) {
  return Model.getUserById(uid).populate('orders');;
}

Model.removeOne = function (uid, pid) {
  return Promise.all([Model.getProductById(pid), Model.getUserByIdWithCart(uid)])
    .then(function (results) {
      var product = results[0];
      var user = results[1];
      if (!product || !user) return null;
      return Cart.findById(user.shoppingCart)
        .then(function (cart) {

          for (var i = 0; i < cart.items.length; i++) {
            if (cart.items[i].product == pid) {
              var item = cart.items[i];
              item.qty = item.qty - 1;
              if (cart.items[i].qty < 1)
                cart.items.splice(i, 1);
              else {
                item.price = product.price;
                item.total = item.qty * item.price;
              }
            }
          }

          cart = Model.updateOneCart(cart)
          return cart.save();
        })
    }).catch(function (errors) { console.error(errors); return null; })
}
Model.removeAll = function (uid, pid) {
  return Promise.all([Model.getProductById(pid), Model.getUserByIdWithCart(uid)])
    .then(function (results) {
      var product = results[0];
      var user = results[1];
      if (!product || !user) return null;
      return Cart.findById(user.shoppingCart)
        .then(function (cart) {
          for (var i = 0; i < cart.items.length; i++) {
            if (cart.items[i].product == pid) {
              cart.items.splice(i, 1);
            }
          }
          cart = Model.updateOneCart(cart)
          return cart.save();
        })
    }).catch(function (errors) { console.error(errors); return null; })

};
Model.updateOneCart = function (cart) {
  cart.qty = 0;
  cart.subtotal = 0;
  for (var i = 0; i < cart.items.length; i++) {
    cart.qty = cart.qty + cart.items[i].qty;
    cart.subtotal = cart.subtotal + cart.items[i].total;
  }

  cart.tax = cart.subtotal * 0.21;
  cart.total = cart.subtotal + cart.tax;
  return cart;
}

module.exports = Model;