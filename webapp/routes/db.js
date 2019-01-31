var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'csye_6225'
});

var sql = 'SELECT * FROM users';

pool.query(sql, function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
});

function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(sql, function (err, rows) {
            callback(err, rows);
            connection.release();
        });
    });
}
function createUser(username,password){
    var promise = new Promise(function(resolve){
        var sql = 'INSERT INTO users(username,password) VALUES("' + username + '","' + password + '")';
        pool.query(sql, function (err) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------INSERT----------------------------');
            console.log(username + ' ' + password);
            console.log('-----------------------------------------------------------------\n\n');
            resolve(true);
        });
    });
    return promise;
}

function checkUser(username,password){
    var promise = new Promise(function(resolve){
        var sql = 'SELECT * FROM users WHERE username="' + username + '" AND password="' + password +'"';
        pool.query(sql, function (err,result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if(result[0]){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    });
    return promise;
}

function searchUser(username){
    var promise = new Promise(function(resolve){
        var sql = 'SELECT * FROM users WHERE username="' + username + '"';
        pool.query(sql, function (err,result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if(result[0]){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    });
    return promise;
}

module.exports = {
    query,
    createUser,
    checkUser,
    searchUser
};