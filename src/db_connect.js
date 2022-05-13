require('dotenv').config();
const pg = require('pg');

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
};

// console.log('config', config);
const client = new pg.Client(config);

module.exports = client;