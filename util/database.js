const Sequelize = require('sequelize');

const sequelize = new Sequelize('test-node-project', 'root', '', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;