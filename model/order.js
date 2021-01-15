var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/*

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

*/
var schema = Schema({



  number: { type: Number },
  date: { type: Date },
  address: { type: String},
  cardNumber: { type: Number },
  cardOwner: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  subtotal: { type: Number },
  tax: { type: Number },
  total: { type: Number },
  items: {
    type: [
      {
        title: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
        //product: { type: Schema.Types.ObjectId, ref: 'Product' }
        product: { type: String }
      }]
  }
});

module.exports = mongoose.model('Order', schema);