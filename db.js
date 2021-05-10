// import mariadb
var mariadb = require('mariadb');

//create a new connectionPool
const pool = mariadb.createPool({
    host: "us-cdbr-east-03.cleardb.com",
    user: "bfb8c00a7a8641",
    password: "2cc1db28",
    database: "heroku_e6cf2ba1d21c3ac"
});

//expose the ability to create new connections

module.exports={
    getConnection: function(){
        return new Promise(function(resolve,reject){
            pool.getConnection().then(function(connection){
                resolve(connection);
            }).catch(function(err){
                reject(err);
            });
        });
    }
}
