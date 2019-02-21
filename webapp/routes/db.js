const Sequelize = require('sequelize');

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

function bcrypthash(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
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

function createUser(username, password) {
    password = bcrypthash(password);
    var promise = new Promise(function (resolve) {
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

function checkUser(username, password) {
    console.log(username + ' ' + password);
    var promise = new Promise(function (resolve) {
        var sql = 'SELECT * FROM users WHERE username="' + username + '"';
        pool.query(sql, function (err, result) {
            if (result[0]) {
                if (bcrypt.compareSync(password, result[0].password)) {

                    console.log('--------------------------SEARCH----------------------------');
                    console.log(result);
                    console.log('-----------------------------------------------------------------\n\n');

                    resolve(true);


                } else {
                    console.log('[SEARCH ERROR] - ', "Auth failed");
                    resolve(false);
                    return;

                }

            } else {
                console.log('[SEARCH ERROR] - ', "Auth failed");
                resolve(false);
                return;

            }


        });
    });

    return promise;
}

function searchUser(username) {
    var promise = new Promise(function (resolve) {
        var sql = 'SELECT * FROM users WHERE username="' + username + '"';
        pool.query(sql, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if (result[0]) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
    return promise;
}

function getIdByUsername(username) {
    var promise = new Promise(function (resolve) {
        var sql = 'SELECT * FROM users WHERE username="' + username + '"';
        console.log(sql);
        pool.query(sql, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if (result[0]) {
                console.log("this is id:" + result[0].id);
                resolve(result[0].id);
            } else {
                console.log('[SEARCH ERROR] - ', "No id can be found");
                return;
            }
        });
    });
    return promise;
}

function getNotesById(id) {
    var promise = new Promise(function (resolve) {
        var sql = 'SELECT * FROM notes WHERE creator_id="' + id + '"';
        pool.query(sql, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if (result) {
                resolve(result);
            } else {
                console.log('[SEARCH ERROR] - ', "No notes belongs to you, please create notes");
                return;
            }
        });
    });
    return promise;
}

function getNoteByNoteId(id, userId) {
    var promise = new Promise(function (resolve) {
        var sql = 'SELECT * FROM notes WHERE id="' + id + '" AND creator_id="' + userId + '"';
        console.log(sql);
        pool.query(sql, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if (result) {
                resolve(result)
            } else {
                console.log('[SEARCH ERROR] - ', "No notes can be found with this note id");
                return;
            }
        });
    });
    return promise;
}

function createNote(id, content, title, createdOn, lastUpdatedOn, userId) {
    var promise = new Promise(function (resolve) {
        var sql = 'INSERT INTO notes(id, content, title, createdOn, lastUpdatedOn, creator_id) VALUES("' +
            id + '","' + content + '","' + title + '","' + createdOn + '","' + lastUpdatedOn + '","' + userId + '")';
        pool.query(sql, function (err) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------INSERT----------------------------');
            console.log(id + " " + content + " " + title + " " + createdOn + " " + lastUpdatedOn + " " + userId);
            console.log('-----------------------------------------------------------------\n\n');
            resolve(true);
        });
    });
    return promise;
}

function deleteNoteByNoteId(id, userId) {
    var promise = new Promise(function (resolve) {
        var sqlSearch = 'SELECT * FROM notes WHERE id="' + id + '" AND creator_id="' + userId + '"';
        var sqlDelete = 'DELETE FROM notes WHERE id="' + id + '" AND creator_id="' + userId + '"';

        pool.query(sqlSearch, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            if (result[0]) {
                pool.query(sqlDelete, function (err) {
                    if (err) {
                        console.log('[DELETE ERROR] - ', err.message);
                        return;
                    }
                    console.log('--------------------------DELETE----------------------------');
                    console.log(id + " " + userId);
                    console.log('-----------------------------------------------------------------\n\n');
                    resolve(true);
                });
            } else {
                resolve(false);
                console.log('[SEARCH ERROR] - ', "No notes can be found with this note id");
                return;
            }
        });


    });
    return promise;
}

function updateNoteByNoteId(id, content, title, lastUpdatedOn, userId) {
    var promise = new Promise(function (resolve) {
        var sql = 'UPDATE notes SET content="' + content + '", title ="' + title + '", lastUpdatedOn = "' + lastUpdatedOn
            + '" WHERE id="' + id + '" AND creator_id="' + userId + '"';
        pool.query(sql, function (err) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------UPDATE----------------------------');
            console.log(id + " " + content + " " + title + " " + lastUpdatedOn + " " + userId);
            console.log('-----------------------------------------------------------------\n\n');
            resolve(true);
        });
    });
    return promise;
}

function createAttachment(id, url, key, noteId) {
    var promise = new Promise(function (resolve) {
        var sql = 'INSERT INTO attachments(id, url, _key, noteId) VALUES("' +
            id + '","' + url + '","' + key + '","' + noteId + '")';
        console.log(sql);
        pool.query(sql, function (err) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------INSERT----------------------------');
            console.log(id + " " + url + " " + key + " " + noteId);
            console.log('-----------------------------------------------------------------\n\n');
            resolve(true);
        });
    });
    return promise;
}

function getAllAttachments(id) {
    var promise = new Promise(function (resolve) {
        var sql = 'SELECT * FROM attachments WHERE noteId="' + id + '"';
        console.log(sql);
        pool.query(sql, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if (result) {
                resolve(result)
            } else {
                console.log('[SEARCH ERROR] - ', "No attachments can be found with this note id");
                return;
            }
        });
    });
    return promise;
}

function findAttachmentByIds(id, noteId) {
    var promise = new Promise(function (resolve) {
        var sql = 'SELECT * FROM attachments WHERE id="' + id + '" AND noteId="' + noteId + '"';
        console.log(sql);
        pool.query(sql, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------SEARCH----------------------------');
            console.log(result);
            console.log('-----------------------------------------------------------------\n\n');
            if (result) {
                resolve(result)
            } else {
                console.log('[SEARCH ERROR] - ', "No attachment can be found with these ids");
                return;
            }
        });
    });
    return promise;
}

function updateAttchment(id, url, key, noteId) {
    var promise = new Promise(function (resolve) {
        var sql = 'UPDATE attachments SET url="' + url + '", _key ="' + key
            + '" WHERE id="' + id + '" AND noteId="' + noteId + '"';
        pool.query(sql, function (err) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            console.log('--------------------------UPDATE----------------------------');
            console.log(id + " " + url + " " + key + " " + noteId);
            console.log('-----------------------------------------------------------------\n\n');
            resolve(true);
        });
    });
    return promise;
}

function deleteAttachmentById(id, noteId) {
    var promise = new Promise(function (resolve) {
        var sqlSearch = 'SELECT * FROM attachments WHERE id="' + id + '" AND noteId="' + noteId + '"';
        var sqlDelete = 'DELETE FROM attachments WHERE id="' + id + '" AND noteId="' + noteId + '"';

        pool.query(sqlSearch, function (err, result) {
            if (err) {
                console.log('[SEARCH ERROR] - ', err.message);
                return;
            }
            if (result[0]) {
                pool.query(sqlDelete, function (err) {
                    if (err) {
                        console.log('[DELETE ERROR] - ', err.message);
                        return;
                    }
                    console.log('--------------------------DELETE----------------------------');
                    console.log(id + " " + noteId);
                    console.log('-----------------------------------------------------------------\n\n');
                    resolve(true);
                });
            } else {
                resolve(false);
                console.log('[SEARCH ERROR] - ', "No notes can be found with this note id");
                return;
            }
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
    deleteNoteByNoteId,
    updateNoteByNoteId,
    createAttachment,
    getAllAttachments,
    updateAttchment,
    findAttachmentByIds,
    deleteAttachmentById
};
