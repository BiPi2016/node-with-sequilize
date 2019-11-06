const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database.js');
const Admin = require('./models/admin');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    Admin.findByPk(1)
    .then( admin => {
        req.admin = admin;
        console.log('******************************************');
        console.log(req.admin.name);
        next();
    })
    .catch( err => {
        console.log(err);
        next(err);
    });
});

app.use( (req, res, next) => require('./util/setUser')(req, res, next));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Admin.hasMany(Product);
Product.belongsTo(Admin, {contraints: true});
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

sequelize.sync({force: true})
.then( result => {
    return Admin.findByPk(1);
})
.then( admin => {
    if(!admin) {
        return Admin.create({name: 'Admin', email: 'bp.singh@hotmail.com', telephone: '0738957790'});
    }
    return Promise.resolve(admin);
})
.then( result => {
    return User.findByPk(1);
})
.then( user => {
    if(!user)
        return User.create({name: 'Some user', email: 'bp.singh@gmail.com', telephone: '634090090'});
    return user;
})
.then( user => {
    console.log(user.name + ' is our user');
    return user.createCart();
})
.then( cart => {
    app.listen(3000);    
})
.catch( err => {
    console.log(err);
});

