const { Pool } = require('pg');
require ('dotenv').config();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Quiz',
    password: 'Adimin123',
    port: 5432,
});

pool.connect();

module.exports = pool;