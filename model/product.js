var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  price: {type: Number, required: true},
  description: { type: String, required: true },
  tam: { type: String, required: true },
  procesador: { type: String, required: true },
  ram: { type: String, required: true },
  disco: { type: String, required: true },
  qtyItem: { type: Number, required: true }
});


module.exports = mongoose.model('Product', schema);
