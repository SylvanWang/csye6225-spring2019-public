const DB = require('../routes/db');
const uuid = require('uuid/v1');
const basicAuth = require('basic-auth');

// For assignment 3
function getMyNotes(req, res) {
    if (res.locals !== undefined) {
        var idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function (id) {// value is id
            if (id != null) {
                var notesPromise = DB.getNotesById(id);

                notesPromise.then(function (notes) {
                        if (notes.length !== 0) {
                            console.log('search success!');
                            console.log(notes);
                            res.status(200).json(notes);
                        } else {
                            console.log('search fail!');
                            res.status(200).json({status: 200, message: "No note records"});
                        }
                    }
                );
            } else {
                console.log('search fail');
                return res.status(400).send({
                    status: 400,
                    message: "No user id can be got"
                });
            }
        });
    }
}

function updateNote(req, res) {
let currentDate = (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':');

    let noteId = req.params.id;
    console.log("nodeId: " + noteId);

    if (res.locals !== undefined) {
        var idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function (id) {// value is id
            if (id != null) {
                var notePromise = DB.updateNoteByNoteId(noteId, 
                                req.body.content, req.body.title, currentDate, id);
                console.log("Id: " + id);
                notePromise.then(function (value) {
                    console.log(value);
                    if (value) {
                        console.log('update success!');
                        return res.status(200).send({
                            status: 200,
                            message: "update successfully"
                        });
                    } else {
                        console.log('update fail');
                        return res.status(400).send({
                            status: 400,
                            message: "no notes with this id can be found"
                        });
                    }
                });
            }
        });
    } }

function getMyNote(req, res) {

    let noteId = req.params.id;
    console.log("nodeId: " + noteId);

    if (res.locals !== undefined) {
        var idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function (id) {// value is id
            if (id != null) {
                var notePromise = DB.getNoteByNoteId(noteId, id);
                console.log("Id: " + id);
                notePromise.then(function (note) {
                    console.log("Note: " + note);
                    if (note.length != 0) {
                        console.log('search success!');
                        return res.status(200).send({
                            status: 200,
                            message: note
                        });
                    } else {
                        console.log('search fail');
                        return res.status(400).send({
                            status: 400,
                            message: "no notes with this id can be found"
                        });
                    }
                });
            }
        });
    }
}

function createNote(req, res) {
    let currentDate = (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':');
    if (req.body !== undefined && res.locals !== undefined) {
        let idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function (id) {
            let promise = DB.createNote(uuid(),
                req.body.content, req.body.title, currentDate, currentDate, id);
            promise.then(function (value) {
                if (value) {
                    res.status(200).json({status: 200, message: 'Note created: ' + req.body.title});
                } else {
                    res.status(400).json({status: 400, message: 'Failed to create note'});
                }
            });
        });
    }
}

function deleteNote(req, res) {
    let noteId = req.params.id;
    console.log("nodeId: " + noteId);

    if (res.locals !== undefined) {
        var idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function (id) {// value is id
            if (id != null) {
                var notePromise = DB.deleteNoteByNoteId(noteId, id);
                console.log("Id: " + id);
                notePromise.then(function (value) {
                    console.log(value);
                    if (value) {
                        console.log('delete success!');
                        return res.status(200).send({
                            status: 200,
                            message: "delete successfully"
                        });
                    } else {
                        console.log('delete fail');
                        return res.status(400).send({
                            status: 400,
                            message: "no notes with this id can be found"
                        });
                    }
                });
            }
        });
    }
}

function getTime(req, res) {
    res.status(200).send({
        status: 200,
        message: new Date()
    });
}

function createUser(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var emailCheck = validateEmail(username);
    var passwordFormatCheck = enforcePassword(password);


    if (emailCheck) {
        if (passwordFormatCheck) {
            var promise = DB.searchUser(username);
            promise.then(function (value) {
                if (value) {
                    console.log('search success!');
                    return res.status(400).send("User exists");
                } else {
                    console.log('search fail');
                    var promise = DB.createUser(username, password);
                    promise.then(function (value) {
                        if (value) {
                            console.log('insert success!');
                            res.status(200).send(true);
                        } else {
                            console.log('insert fail!');
                            res.status(200).send(false);
                        }
                    });
                }
            });
        } else return res.status(400).send({
            status: 400,
            message: "Bad password: Password has to contain 1. Upper case character 2. Lower case character 3. Numbers from 0-9 4. ON of the Special character $@! 4. Length has to be in 6-12"
        })
    } else return res.status(400).send({
        status: 400,
        message: "Bad request: username is not an email"
    });
}

function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

function enforcePassword(password) {
    const passwordRegex = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$@!])\S{6,12}$/;
    return passwordRegex.test(String(password));
}

function auth(req, res, next) {

    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm = Input Username & Password');
        return res.status(401).send({
            status: 401,
            message: "You haven't logged in. Authorization Required."
        });
    }

    function authorized(res) {
        res.set('WWW-Authenticate', 'Basic realm = Input Username & Password');
        console.log('auth success!');
    }

    const auth = req.get("authorization");

    if (auth) {
        let user = Buffer.from(auth.split(" ").pop(), "base64").toString("ascii").split(":");
        if (!user[0])
            if (!user[1])
                return unauthorized(res);

        var promise = DB.checkUser(user[0], user[1]);
        promise.then(function (value) {
            if (value) {
                console.log('search success!');
                authorized(res);
                res.locals.user = user[0];
                return next();
            } else {
                console.log('search fail');
                return res.status(400).send({
                    status: 400,
                    message: "Invalid credentials"
                });
            }
        });

    } else {
        return unauthorized(res);
    }
}


module.exports = {
    getTime,
    auth,
    createUser,
    getMyNotes,
    getMyNote,
    createNote,
    updateNote,
    deleteNote
};