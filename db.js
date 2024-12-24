const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});


sequelize.authenticate()
    .then(() => {
    console.log('Conexión exitosa a MySQL con Sequelize');
    })
    .catch((err) => {
    console.error('No se pudo conectar a MySQL:', err);
    });

module.exports = sequelize;
