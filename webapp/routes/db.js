const bcrypt = require('bcrypt');
var mysql = require('mysql');
const config = require('../config');
const NoteModel = require('../models/noteModel');
var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
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

function bcrypthash(password){
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    var hash = bcrypt.hashSync(password, salt);
    return hash;
}

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
    password = bcrypthash(password);
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
    password = bcrypthash(password);
    console.log(username + ' ' + password);
    var promise = new Promise(function(resolve){
        var sql = 'SELECT * FROM users WHERE username="' + username + '"';
        pool.query(sql, function (err,result) {
            bcrypt.compare(result[0].password,password).then(function(res){
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
                else {
                    resolve(false);
                }
            });
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

function getIdByUsername(username){
    var promise = new Promise(function(resolve){
        var sql = 'SELECT * FROM users WHERE username="' + username + '"';
        console.log(sql);
        pool.query(sql, function (err,result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if(result[0]){
                console.log("this is id:"+result[0].id);
                resolve(result[0].id);
            }
            else{
                console.log('[SEARCH ERROR] - ', "No id can be found");
                return;
            }
        });
    });
    return promise;
}

function getNotesById(id){
    var promise = new Promise(function(resolve){
        var sql = 'SELECT * FROM notes WHERE creater_id="' + id + '"';
        pool.query(sql, function (err,result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if(result){
                resolve (result);
            }
            else{
                console.log('[SEARCH ERROR] - ', "No notes belongs to you, please create notes");
                return;
            }
        });
    });
    return promise;
}

function getNoteByNoteId(id, userId){
    var promise = new Promise(function(resolve){
        var sql = 'SELECT * FROM notes WHERE id="' + id + '" AND creater_id="' + userId + '"';
        console.log(sql);
        pool.query(sql, function (err,result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if(result){
                resolve (result)
            }
            else{
                console.log('[SEARCH ERROR] - ', "No notes can be found with this note id");
                return;
            }
        });
    });
    return promise;
}

function createNote(id, content, title, createdOn, lastUpdatedOn, userId) {
    var promise = new Promise(function(resolve){
        var sql = 'INSERT INTO notes(id, content, title, createdOn, lastUpdatedOn, creater_id) VALUES("' +
            id + '","' + content + '","' + title + '","' + createdOn + '","' + lastUpdatedOn + '","' + userId + '")';
        pool.query(sql, function (err) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------INSERT----------------------------');
            console.log(id + " " +  content + " " +  title + " " +  createdOn + " " + lastUpdatedOn + " " + userId);
            console.log('-----------------------------------------------------------------\n\n');
            resolve(true);
        });
    });
    return promise;
}


module.exports = {
    query,
    createUser,
    checkUser,
    searchUser,
    getIdByUsername,
    getNotesById,
    getNoteByNoteId,
    createNote,
    bcrypthash,
    NoteModel
};