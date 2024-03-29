const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
      Product.fetchAll(products => {
        req.user.getCart().then(cart => {
          console.log(cart)
          return cart.getProducts().then(products => {
            res.render('shop/cart',{
              path:'/cart',
              pageTitle:products,
              products:products
            })
          }).catch(err=> {
            console.log(err)
          })
        })
    });
  }
)};

exports.postCart = (req, res, next) => {
 const prodId = res.body.productId;
 let fetchedCart;
 req.user.getCart()
 .then(cart => {
  fetchedCart = cart;
    return cart.getProducts({where :{id:prodId}})
 })
 .then(products => {
  let product;
  if (products.length>0){
      product = products[0];
  }
  let newQunatity = 1;
  if (product) {

  }
  return Product.findById(prodId).then(product => {
    return fetchedCart.addProduct(product,{through:{quantity:newQunatity}})
  }).catch(err => {
    console.log(err)
  })
 })
 .then(() => {
  res.redirect('/cart')
 })
 .catch(err => {
  console.log(err)
 })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
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
