var Model = {}

Model.getProducts = function () {
  return $.ajax({ url: '/api/products', method: 'GET' });
}

Model.signin = function (email, password) {
  return $.ajax({
    url: '/api/users/signin',
    method: 'POST',
    data: { email, password }
  });
}
Model.signup = function (name, surname, address, birth, email, password) {
  result = $.ajax({
    url: '/api/users/signup',
    method: 'POST',
    data: { name, surname, address, birth, email, password }
  });
  return result;
}

Model.getUserId = function () {
  var decoded = decodeURIComponent(document.cookie);
  return decoded.substring(7, decoded.length);
}

Model.signout = function () {
  document.cookie = 'userid=;expires=0;path=/;'
}

Model.getUserCartQty = function () {
  return $.ajax({ url: '/api/cart/qty', method: 'GET' })
}

Model.buy = function (pid) {
  return $.ajax({ url: '/api/cart/items/product/' + pid, method: 'POST' })
}

Model.getCart = function () {
  return $.ajax({ url: '/api/cart', method: 'GET' })
}

Model.getOrders = function () {
  return $.ajax({ url: '/api/orders', method: 'GET' })
}

Model.getProfile = function () {
  return $.ajax({ url: '/api/profile', method: 'GET' })
}
Model.removeOne = function (pid) {
  return $.ajax({ url: '/api/cart/items/product/' + pid + '/one', method: 'DELETE' })
}

Model.removeAllItems = function (pid) {
  return $.ajax({ url: '/api/cart/items/product/' + pid + '/all', method: 'DELETE' })
}



Model.purchase = function (date, address, cardNumber, cardOwner) {
  result = $.ajax({
    url: '/api/orders',
    method: 'POST',
    data: { date, address, cardNumber, cardOwner }
  });
  return result;
}

Model.getOrder = function (oid) {

  var url = '/api/orders/id/' + oid
  console.log(url)
  result = $.ajax({ url: url, method: 'GET' })
  return result;
}