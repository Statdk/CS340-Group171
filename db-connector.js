// Get an instance of mysql we can use in the app
var mysql = require("mysql");

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_shaweth',
    password        : '4421',
    database        : 'cs340_shaweth'
})
// var pool = mysql.createPool({
//     connectionLimit: 10,
//     multipleStatements: true,
//     host: "classmysql.engr.oregonstate.edu",
//     user: "cs340_padbergm",
//     password: "0166",
//     database: "cs340_padbergm",
// });

// Export it for use in our application
module.exports.pool = pool;
