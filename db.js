// import mariadb
var mariadb = require('mariadb');

//create a new connectionPool
const pool = mariadb.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Password123!",
    database: "game"
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
