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

  Model.getUserId = function () {
    var decoded = decodeURIComponent(document.cookie);
    return decoded.substring(7, decoded.length);
  }

  Model.signout = function () {
    //Model.user = null;
    document.cookie = 'userid=;expires=0;path=/;'
  }

  Model.getUserCartQty = function () {
    return $.ajax({ url: '/api/cart/qty', method: 'GET' })
  }
  
  Model.buy = function (pid) {
    return $.ajax({ url: '/api/cart/items/product/'+pid, method: 'POST' })
  }

  Model.getCart = function () {
    return $.ajax({ url: '/api/cart', method: 'GET' })
  }

  Model.removeOne = function (pid) {
    return $.ajax({ url: '/api/cart/items/product/' + pid + '/one', method: 'DELETE' })
    }
  