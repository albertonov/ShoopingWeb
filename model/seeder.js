var mongoose = require('mongoose');
var User = require('./user');
var Cart = require('./shopping-cart');
var Product = require('./product');
var Order = require('./order');

var uri = 'mongodb://localhost/gameshop';
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('connecting', function () { console.log('Connecting to ', uri); });
db.on('connected', function () { console.log('Connected to ', uri); });
db.on('disconnecting', function () { console.log('Disconnecting from ', uri); });
db.on('disconnected', function () { console.log('Disconnected from ', uri); });
db.on('error', function (err) { console.error('Error ', err.message); });



var cart = new Cart({ items: [], qty: 0, total: 0, subtotal: 0, tax: 0 });
var user = new User({ email: 'alberto@gmail.com', password: 'admin', name: 'Alberto', surname: 'Novillo', birth: '2020-12-09', address: 'ESII, UCLM', shoppingCart: cart, order:[] });

var products = [
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
    url: 'images/xv550.png',
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
    url: 'images/hp.png',
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
    url: 'images/lenovo.png',
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
    url: 'images/trigger.png',
    description: 'Designed for working in bright-light conditions, the large 14” narrow 7.3mm display of the Acer Chromebook 314 is ideal for greater productivity. Due his long battery life you can do everything.',
    price: 999.99,
    tam: '21.3" Full HD 1920 x 1080',
    procesador: 'Intel Core i51035G4 1.1GHz' ,
    ram: '32Gb RAM ' ,
    disco: '128 GB SSD',
    qtyItem: 0
  }
];

number= new Date().getTime();
var neworder = new Order({
  'items': [{
    'qty': 1,
    'product': "1",
    'title': "Microsoft Surface Pro 7",
    'price': 999.99,
    'total': 999.99
}],
'qty': 1,
'total': 1209.9879,
'subtotal': 999.99,
'tax': 209.9979,
'user_id': user,
'number': number,
'date': '1998-03-31',
'cardNumber': 1111222233334444,
'cardOwner': "Albero",
});

user.orders.push(neworder);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(function () { return Cart.deleteMany() })
.then(function () { return User.deleteMany() })
.then(function () { return Product.deleteMany() })
.then(function () { return Order.deleteMany() })
.then(function () { return cart.save() })
.then(function () { return user.save() })
.then(function () { return neworder.save() })
.then(function () { return db.collection("products").insertMany(products) })
.then(function () { return mongoose.disconnect(); })
.catch(function (err) { console.error('Error ', err.message); })

