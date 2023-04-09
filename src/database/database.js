const mysql = require('promise-mysql');
const config = require('../config');

const connection = mysql.createConnection({
    host: config.DATABASE_HOST,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME
});

const getConnection = () => {
    return connection;
}

module.exports = {
    getConnection
}