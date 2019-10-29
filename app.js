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
const User = require('./models/user');
const Product = require('./models/product');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then( user => {
        req.user = user;
        console.log('******************************************');
        console.log(req.user);
        next();
    })
    .catch( err => {
        console.log(err);
        next(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, {contraints: true, onDelete: 'CASCADE'});


sequelize.sync({force: true})
.then( result => {
    return User.findByPk(1);
})
.then( user => {
    if(!user) {
        return User.create({name: 'Admin', email: 'bp.singh@hotmail.com', telephone: '0738957790'});
    }
    return Promise.resolve(user);
})
.then( user => {
    console.log(user);
    app.listen(3000);
})
.catch( err => {
    console.log(err);
});

