const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('KlaimOnlineDB', 'sa', 'sabdha04', {
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
    dialectOptions: {
        options: {
            encrypt: true, 
        },
    },
});

module.exports = sequelize;
