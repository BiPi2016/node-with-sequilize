const sequelize = require('./database.js');

const User = require('../models/user');

module.exports = (req, res, next) => {
    User.findByPk(1)
    .then( user => {
        req.user = user;
        console.log('The user is called ' + req.user.name);
        next();
    })
    .catch( err => {
        console.log(err);
        next(err);
    });
};
