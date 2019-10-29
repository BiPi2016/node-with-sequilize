const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    product: false,
    editMode: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.getEditProduct = (req, res, next) => {
  Product.findByPk(req.params.productId)
  .then( product => {
    res.render('admin/edit-product', {
      pageTitle: product.title,
      product: product,
      path: '/admin/add-product',
      editMode: true,
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    })
  })
  .catch( err => {
    console.log(err);
    next(err);
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.upsert({
    id: id,
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user.id
  })
  .then( results => {
    res.redirect('/admin/products');
  })
  .catch( err => next(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => next(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then( product => {
    return product.destroy();
  })
  .then( () => {
    console.log('Product deleted!');
    res.redirect('/admin/products');
  })
  .catch( err => {
    console.log(err);
    next(err);
  });
}
