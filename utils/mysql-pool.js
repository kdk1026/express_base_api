const mysql = require('mysql2');
const config = require('../config/db-config');

const pool = mysql.createPool(config);

function getConnection(callback) {
    pool.getConnection(function(err, conn) {
        if ( !err ) {
            callback(conn);
        } else {
            throw err;
        }
    });
}

module.exports = getConnection;