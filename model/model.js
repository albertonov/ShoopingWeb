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

Model.addToCart = function(id){
  var anadido = false
  for (k = 0; k< Model.products.length; k++) {
    if (Model.products[k]._id == id){
        productoToAdd = Model.products[k];
        
        //comprobar si el elemento ya esta añadido a la lista
        for (i=0; i<Model.user.shoppingCart.items.length; i++){
          if (Model.user.shoppingCart.items[i]._id == productoToAdd._id){
            Model.user.shoppingCart.items[i].qtyItem +=1;
            Model.user.shoppingCart.qty +=1;
            Model.user.shoppingCart.subtotal += Model.user.shoppingCart.items[i].price;
            Model.user.shoppingCart.tax = Model.user.shoppingCart.subtotal * 0.21;
            Model.user.shoppingCart.total = Model.user.shoppingCart.subtotal + Model.user.shoppingCart.tax;
            anadido = true;
          }
        }
        if (!anadido){
          var lastElementIndex = Model.user.shoppingCart.items.push(productoToAdd);
          Model.user.shoppingCart.items[lastElementIndex-1].qtyItem +=1;
          Model.user.shoppingCart.qty +=1;
          Model.user.shoppingCart.subtotal += productoToAdd.price;
          Model.user.shoppingCart.tax = Model.user.shoppingCart.subtotal * 0.21;
          Model.user.shoppingCart.total = Model.user.shoppingCart.subtotal + Model.user.shoppingCart.tax;
          
        }
    }      
  }
};

Model.removeOneCartItem = function (id) {
  for (i=0; i<Model.user.shoppingCart.items.length; i++){
    if (Model.user.shoppingCart.items[i]._id == id){
          for (k=0; k<Model.products.length; k++) {
            if(Model.products[k]._id == id){
              var productReference = Model.products[k];
            }
          }
          Model.user.shoppingCart.qty -=1;
          Model.user.shoppingCart.subtotal -= productReference.price;
          Model.user.shoppingCart.tax = Model.user.shoppingCart.subtotal * 0.21;
          Model.user.shoppingCart.total = Model.user.shoppingCart.subtotal + Model.user.shoppingCart.tax;

       if (Model.user.shoppingCart.items[i].qtyItem == 1){
         //last element
          Model.user.shoppingCart.items.splice(i, 1);
       }
       else{
          Model.user.shoppingCart.items[i].qtyItem -= 1;
       }
    }
  }
};



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

  Model.getCurrentProfile = function (){
    return Model.user;
  }

  Model.getUserById = function (userid) {
    for (var i = 0; i < Model.users.length; i++) {
  if (Model.users[i]._id == userid)
    return Model.users[i];
    }
  return null;
  }


  Model.getUserByIdWithCart = function (userid) {
    return User.findById(userid).populate('shoppingCart');
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
          console.log("...............................................................")
          console.log(item)
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
   for (var i = 0; i <  user.shoppingCart.items.length; i++) {
      user.shoppingCart.qty =  user.shoppingCart.qty +  user.shoppingCart.items[i].qty;
      user.shoppingCart.subtotal =  user.shoppingCart.subtotal +  user.shoppingCart.items[i].total;
   }
   
    user.shoppingCart.tax =  user.shoppingCart.subtotal * 0.21;
    user.shoppingCart.total =  user.shoppingCart.subtotal +  user.shoppingCart.tax;
    
 }
 
/////////////////////////////////////////////////////
 Model.getCartByUserId = function (uid) {
  return Model.getUserById(uid).shoppingCart;
  }

 Model.getOrdersByUserId = function (uid){
  return Model.getUserById(uid).orders;
 }
  Model.removeOne = function (uid, pid) {
    var product = Model.getProductById(pid);
    var user = Model.getUserById(uid);
    if (!product || !user) return null;
    for (var i = 0; i < user.shoppingCart.items.length; i++) {
      if (user.shoppingCart.items[i].product == pid) {
        var item = user.shoppingCart.items[i];
        item.qty = item.qty - 1;
        if (user.shoppingCart.items[i].qty < 1)
          user.shoppingCart.items.splice(i, 1);
        else {
          item.price = product.price;
          item.total = item.qty * item.price;
        }  }  }
       
    this.updateShoppingCart(user);
    return user.shoppingCart;
  }

  Model.removeAll = function (uid, pid) {
    var product = Model.getProductById(pid);
    var user = Model.getUserById(uid);
    

    for (var i = 0; i < user.shoppingCart.items.length; i++) {
      if (user.shoppingCart.items[i].product == pid) {
        user.shoppingCart.items.splice(i, 1);
      }
    }
    
    this.updateShoppingCart(user);
    return user.shoppingCart;
    
  };


module.exports = Model;

