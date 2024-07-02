const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.join(__dirname, '../env/.env.production') });
} else if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: path.join(__dirname, '../env/.env.development') });
} else if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: path.join(__dirname, '../env/.env.local') });
} else {
    throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}

const config = {
    host : process.env.db_host,
    port : process.env.db_port,
    user : process.env.db_user,
    password : process.env.db_password,
    database: process.env.db_database,
    connectionLimit : process.env.db_connection_limit
}

module.exports = config;