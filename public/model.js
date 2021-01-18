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

Model.getToken = function () {
  var decoded = decodeURIComponent(document.cookie);
  return decoded.substring(6, decoded.length);
}


Model.signout = function () {
  document.cookie = 'token=;expires=0;path=/;'
}

Model.getUserCartQty = function () {
  return $.ajax({
    url: '/api/cart/qty', method: 'GET', beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
    }
  })
}

Model.buy = function (pid) {
  return $.ajax({ url: '/api/cart/items/product/' + pid, method: 'POST', beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
  } })
}

Model.getCart = function () {
  return $.ajax({ url: '/api/cart', method: 'GET' , beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
  }})
}

Model.getOrders = function () {
  return $.ajax({ url: '/api/orders', method: 'GET' , 
  beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
  }})
}

Model.getProfile = function () {
  return $.ajax({ url: '/api/profile', method: 'GET' , beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
  }})
}

Model.removeOne = function (pid) {
  return $.ajax({ url: '/api/cart/items/product/' + pid + '/one', method: 'DELETE', beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
  } })
}


Model.removeAllItems = function (pid) {
  return $.ajax({ url: '/api/cart/items/product/' + pid + '/all', method: 'DELETE' , beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
  }})
}



Model.purchase = function (date, address, cardNumber, cardOwner) {
  result = $.ajax({
    url: '/api/orders',
    method: 'POST',
    data: { date, address, cardNumber, cardOwner }, 
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
    }
  });
  return result;
}

Model.getOrder = function (oid) {

  var url = '/api/orders/id/' + oid
  result = $.ajax({ url: url, method: 'GET', 
  beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
  }})
  return result;
}