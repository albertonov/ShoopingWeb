var User = require('./user');
var Cart = require('./shopping-cart')
var Product = require('./product');
var Model = {}

/*
Model.products = [
  {
    _id: 1,
    title: 'Microsoft Surface Pro 7',
    url: 'images/sfp.png',
    description: 'Ultra-light and versatile. At your desk, on the couch, or in the yard, get more done your way with Surface Pro 7, featuring a laptop-class Intel® Core™ processor, all-day battery,¹ and HD cameras.',
    price: 999.99,
    tam: '12.3" Full HD 1920 x 1080',
    procesador: 'Intel Core i51035G4 1.1GHz' ,
    ram: '8Gb RAM LPDDR4X' ,
    disco: '128 GB SSD',
    qtyItem: 0
  },
  {
    _id: 2,
    title: 'Apple MacBook Air',
    url: 'images/mas.png',
    description: 'The Most Popular Mac Now Has Up to 2x Faster Performance. The incredibly thin and light MacBook Air is now more powerful than ever. It features a brilliant Retina display, new Magic Keyboard and Touch ID.',
    price: 1099.99,
    tam: '12.1" 4k 1920 x 1080',
    procesador: 'Intel Core i51335G4 3.4GHz' ,
    ram: '32Gb RAM LPDDR4X' ,
    disco: '512 GB SSD',
    qtyItem: 0
  },
  {
    _id: 3,
    title: 'Lenovo IdeaPad 5',
    url: 'images/lip.png',
    description: 'Designed for working in bright-light conditions, the large 14” narrow 7.3mm display of the Acer Chromebook 314 is ideal for greater productivity. Due his long battery life you can do everything.',
    price: 899.99,
    tam: '16.8" 1920 x 1080',
    procesador: 'Intel Core i51035G4 3GHz' ,
    ram: '16Gb RAM LPDD' ,
    disco: '256 GB SSD',
    qtyItem: 0
  },
  {
    _id: 4,
    title: 'Acer Chromebook 314',
    url: 'images/acb.png',
    description: 'Designed for working in bright-light conditions, the large 14” narrow 7.3mm display of the Acer Chromebook 314 is ideal for greater productivity. Due his long battery life you can do everything.',
    price: 999.99,
    tam: '21.3" Full HD 1920 x 1080',
    procesador: 'Intel Core i51035G4 1.1GHz' ,
    ram: '32Gb RAM ' ,
    disco: '128 GB SSD',
    qtyItem: 0
  },
  {
    _id: 5,
    title: 'Asus XV550',
    url: 'images/sfp.png',
    description: 'Ultra-light and versatile. At your desk, on the couch, or in the yard, get more done your way with Surface Pro 7, featuring a laptop-class Intel® Core™ processor, all-day battery,¹ and HD cameras.',
    price: 999.99,
    tam: '12.3" Full HD 1920 x 1080',
    procesador: 'Intel Core i51035G4 1.1GHz' ,
    ram: '8Gb RAM LPDDR4X' ,
    disco: '128 GB SSD',
    qtyItem: 0
  },
  {
    _id: 6,
    title: 'HP pavilion Laptop',
    url: 'images/mas.png',
    description: 'The Most Popular Mac Now Has Up to 2x Faster Performance. The incredibly thin and light MacBook Air is now more powerful than ever. It features a brilliant Retina display, new Magic Keyboard and Touch ID.',
    price: 1099.99,
    tam: '12.1" 4k 1920 x 1080',
    procesador: 'Intel Core i51335G4 3.4GHz' ,
    ram: '32Gb RAM LPDDR4X' ,
    disco: '512 GB SSD',
    qtyItem: 0
  },
  {
    _id: 7,
    title: 'Lenovo SmartPad',
    url: 'images/lip.png',
    description: 'Designed for working in bright-light conditions, the large 14” narrow 7.3mm display of the Acer Chromebook 314 is ideal for greater productivity. Due his long battery life you can do everything.',
    price: 899.99,
    tam: '16.8" 1920 x 1080',
    procesador: 'Intel Core i51035G4 3GHz' ,
    ram: '16Gb RAM LPDD' ,
    disco: '256 GB SSD',
    qtyItem: 0
  },
  {
    _id: 8,
    title: 'Asus Trigger',
    url: 'images/acb.png',
    description: 'Designed for working in bright-light conditions, the large 14” narrow 7.3mm display of the Acer Chromebook 314 is ideal for greater productivity. Due his long battery life you can do everything.',
    price: 999.99,
    tam: '21.3" Full HD 1920 x 1080',
    procesador: 'Intel Core i51035G4 1.1GHz' ,
    ram: '32Gb RAM ' ,
    disco: '128 GB SSD',
    qtyItem: 0
  }
];

*/
Model.getProducts = function(){
  result =  Product.find();
  
  return result;
 }

Model.order=[{}];
/*
Model.users = [{
  _id: 100, email: 'alberto@gmail.com',
  password: 'admin',
  name: 'Alberto',
  surname: 'Novillo',
  birth: '1998-09-12',
  address: 'ESII, UCLM',
  shoppingCart: { items: [], qty:0, total:0, subtotal:0, tax:0 },
  orders: []
}];
*/
idCounter = 101;

Model.user = null;

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
  })} 

Model.signout = function () {
  Model.user = null;
  }





Model.purchase = function (date, address, cardNumber, cardOwner, uid) {
  
  number= new Date().getTime();
  Model.order.number= number;
  Model.order.date= date;
  Model.order.address= address;
  Model.order.cardNumber= cardNumber;
  Model.order.cardOwner= cardOwner;

  currentUser = this.getUserById(uid)

  
  Model.order.subtotal= currentUser['shoppingCart'].subtotal; 
  Model.order.tax= currentUser['shoppingCart'].tax;
  Model.order.total= currentUser['shoppingCart'].total;
  Model.order.items= currentUser['shoppingCart'].items;
  currentUser.orders.push(vOrder = Object.assign({}, Model.order));

  Model.resetCart();
  
  return number;
}

Model.resetCart = function () {

  Model.user.shoppingCart.items =[];
  Model.user.shoppingCart.qty = 0;
  Model.user.shoppingCart.subtotal = 0;
  Model.user.shoppingCart.tax = 0;
  Model.user.shoppingCart.total = 0;

}

Model.getOrder=function(matching){
  order = [];
  for(var i = 0; i < Model.user.orders.length; i++){
      if(matching == Model.user.orders[i].number){
        order=Model.user.orders[i];
      }
  }
  
  return order;
  };

  /*Model.getCurrentProfile = function (){
    return Model.user;
  }*/

  Model.getUserById = function (userid) {
    //
    return User.findById(userid);
  }


  Model.getUserByIdWithCart = function (userid) {
    //
    return User.findById(userid).populate('shoppingCart');
  }
  Model.getUserCartQty = function (userid) {
    //
    return User.findById(userid).populate({ path: 'shoppingCart', select: 'qty' })
  }




  Model.getProductById = function (pid) {
    //
      return Product.findById(pid);
  }


  Model.buy = function (uid, pid) {
    //
    return Promise.all([Model.getProductById(pid), Model.getUserByIdWithCart(uid)])
      .then(function (results) {
        var product = results[0];
        var user = results[1];
        console.log(user.shoppingCart)
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
    //
    user.shoppingCart.qty = 0;
    user.shoppingCart.subtotal = 0;
   for (var i = 0; i <  user.shoppingCart.items.length; i++) {
      user.shoppingCart.qty =  user.shoppingCart.qty +  user.shoppingCart.items[i].qty;
      user.shoppingCart.subtotal =  user.shoppingCart.subtotal +  user.shoppingCart.items[i].total;
   }
   
    user.shoppingCart.tax =  user.shoppingCart.subtotal * 0.21;
    user.shoppingCart.total =  user.shoppingCart.subtotal +  user.shoppingCart.tax;
    
 }
 

 Model.getCartByUserId = function (uid) {
  //
  return this.getUserByIdWithCart(uid)
  .then(function (sc) { 
    return sc.shoppingCart;
  });

  }

 Model.getOrdersByUserId = function (uid){
  return Model.getUserById(uid).orders;
 }

  Model.removeOne = function (uid, pid) {
    //
    return Promise.all([Model.getProductById(pid), Model.getUserByIdWithCart(uid)])
      .then(function (results){
        var product = results[0];
        var user = results[1];
        if (!product || !user) return null;
        return Cart.findById(user.shoppingCart)
          .then( function (cart){
            
            for (var i = 0; i < cart.items.length; i++) {
              if (cart.items[i].product == pid) {
                var item = cart.items[i];
                item.qty = item.qty - 1;
                if (cart.items[i].qty < 1)
                cart.items.splice(i, 1);
                else {
                  item.price = product.price;
                  item.total = item.qty * item.price;
                }  }  }
               
            cart = Model.updateOneCart(cart)
            return cart.save();
          })
      }).catch(function (errors) { console.error(errors); return null; })
  }
  Model.removeAll = function (uid, pid) {
    return Promise.all([Model.getProductById(pid), Model.getUserByIdWithCart(uid)])
    .then(function (results){
      var product = results[0];
      var user = results[1];
      if (!product || !user) return null;
      return Cart.findById(user.shoppingCart)
      .then( function (cart){
        for (var i = 0; i < cart.items.length; i++) {
          if (cart.items[i].product == pid) {
            cart.items.splice(i, 1);
          }
        } 
        cart = Model.updateOneCart(cart)
        return cart.save();
      })
    }).catch(function (errors) { console.error(errors); return null; })
    /*var product = Model.getProductById(pid);
    var user = Model.getUserById(uid);
    

    for (var i = 0; i < user.shoppingCart.items.length; i++) {
      if (user.shoppingCart.items[i].product == pid) {
        user.shoppingCart.items.splice(i, 1);
      }
    }
    
    this.updateShoppingCart(user);
    return user.shoppingCart;
    */
  };
  Model.updateOneCart = function(cart){
    //
    cart.qty = 0;
    cart.subtotal = 0;
    for (var i = 0; i <  cart.items.length; i++) {
      cart.qty =  cart.qty +  cart.items[i].qty;
      cart.subtotal =  cart.subtotal +  cart.items[i].total;
     }
   
     cart.tax = cart.subtotal * 0.21;
     cart.total =  cart.subtotal +  cart.tax;
     return cart;
  }



module.exports = Model;

