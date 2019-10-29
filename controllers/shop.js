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

exports.postAddToCart = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id, product => {
    console.log('Requested product has id ' + id);
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
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
