const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then ( products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch( err => next(err))
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.productId;
  Product.findByPk(id)
  .then( product => {
    res.render('shop/product-detail.ejs', {
       pageTitle: product.title,
       path: '/',
       product: product
    });
  })
  .catch( err => next(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then( products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch( err => next(err));
};

/* exports.postAddToCart = (req, res, next) => {
  console.log('==========================================');
  console.log('Adding product to cart');
  const id = req.body.productId;
  console.log('Product has the id ' + id);
  Product.findByPk(id, product => {
    console.log('Requested product has id ' + id);
  });
}; */

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then( cart => {
    cart.getProducts()
    .then( products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch( err => console.log(err));    
  })
  .catch( err => {
    console.log(err);
    next(err);
  });
};

exports.postCart = (req, res, next) => {  
  console.log('==========================================');
  console.log('Adding product to cart');
  const prodId = req.body.productId;
  console.log('Product has the id ' + prodId);
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
  .then( cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } })
  })
  .then( products => {
    console.log('Following existing product exist in the cart ' + products);
    let product;
    if(products.length > 0) 
      product = products[0];    

    if(product) {
      // If product exists in the cart
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(prodId)
  })
  .then( product => {
    return fetchedCart.addProduct(product, { through: {quantity: newQuantity} });
  })
  .then( () => {
    res.redirect('/cart');
  })
  .catch( err => next(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: prodId}})
  })
  .then( products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then( results => {
    res.redirect('/cart');
  })
  .catch( err => {
    console.log(err);
    next(err);
  })
};

// Increase product quantity
exports.postCartIncreaseByOne = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity;
  req.user.getCart()
  .then( cart => {  
    fetchedCart = cart;  
    return cart.getProducts({ where: {id: prodId}})
  })
  .then( products => {
    const product = products[0];
    console.log('This products is to be increased by 1 ' + product.title);
    newQuantity = product.cartItem.quantity + 1;
    return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
  })
  .then( () => {
    res.redirect('/cart');
  })
  .catch( err => {
    console.log(err);
    next(err);
  });
};

// Decrease product quantity
exports.postCartDecreaseByOne = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity;
  req.user.getCart()
  .then( cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId}});
  })
  .then( products => {
    const product = products[0];
    newQuantity = product.cartItem.quantity - 1;
    if( newQuantity === 0)
      return res.redirect(307, '/cart-delete-item');  // Status code 307 redirects to specified path with POST method
    return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
  })
  .then( () => {
    res.redirect('/cart');
  })
  .catch( err => {
    console.log(err);
    next(err);
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
