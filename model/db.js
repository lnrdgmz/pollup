const { Pool } = require('pg');

// const config = {
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD,
//   database: process.env.SQL_DATABASE
// }

// if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
//   config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
// }

const pool = Pool();

pool.connect().catch(err => console.error(err));

module.exports = pool;

