const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = Order;
