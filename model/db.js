const { Pool } = require('pg');


const pool = Pool();

pool.connect().catch(err => console.error(err));

module.exports = pool;

