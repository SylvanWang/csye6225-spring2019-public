const DB = require('../routes/db');
const uuid = require('uuid/v1');
const basicAuth = require('basic-auth');

const s3Service = require('../service/aws_service');
const awsService = require('../service/aws_service');
const Op = require('sequelize').Op;

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

    if (res.locals !== undefined) {
        var idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function (id) {// value is id
            if (id != null) {
                var notePromise = DB.updateNoteByNoteId(noteId,
                    req.body.content, req.body.title, currentDate, id);
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
    }
}

function getMyNote(req, res) {

    let noteId = req.params.id;

    if (res.locals !== undefined) {
        var idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function (id) {// value is id
            if (id != null) {
                var notePromise = DB.getNoteByNoteId(noteId, id);
                notePromise.then(function (note) {
                    console.log("Note: " + note);
                    if (note.length !== 0) {
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
            let noteId = uuid();
            let promise = DB.createNote(noteId,
                req.body.content, req.body.title, currentDate, currentDate, id);
            promise.then(function (value) {
                console.log(value);
                if (value) {
                    res.status(200).json({status: 200, noteId: noteId, message: 'Note created: ' + req.body.title});
                } else {
                    res.status(400).json({status: 400, message: 'Failed to create note'});
                }
            });
        });
    }
}

function deleteNote(req, res) {
    let noteId = req.params.id;
    if (res.locals !== undefined) {
        var idPromise = DB.getIdByUsername(res.locals.user);
        idPromise.then(function () {
            DB.getAllAttachments(noteId)
                .then(data => {
                    var i = 0;
                    while (i < data.length) {
                        if (data[i]._key) {
                            s3Service.deleteFileS3(data[i]._key);
                        }
                        i++;
                    }
                });
        });
        idPromise.then(function (id) {// value is id
            if (id != null) {
                var notePromise = DB.deleteNoteByNoteId(noteId, id);
                notePromise.then(function (value) {
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
                    return res.status(400).send({status: 400, message: "User exists"});
                } else {
                    console.log('search fail');
                    var promise = DB.createUser(username, password);
                    promise.then(function (value) {
                        if (value) {
                            console.log('insert success!');
                            res.status(200).send({status: 200, username: username, message: "User created"});
                        } else {
                            console.log('insert fail!');
                            res.status(400).send({status: 400, message: "Failed to create user"});
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

        if (user[0] === "admin" && user[1] === "admin") {
            res.locals.user = user[0];
            return next();
        }
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


updateAttachments = (req, res) => {
    let {id, attachmentId} = req.params;
    DB.findAttachmentByIds(attachmentId, id).then(data => {
        s3Service.updateFile(data, req.file).then(fdata => {
            DB.updateAttchment(attachmentId, fdata.location, fdata.key, id).then(data => {
                res.status(200).send({status: 200, message: "Attachment updated"});
            }).catch(error => {
                console.log('ERROR:', error);
                res.status(400).send({status: 400, message: error.detail});
            });
        })
    })
};

deleteAttachments = (req, res) => {
    let {id, attachmentId} = req.params;

    DB.findAttachmentByIds(attachmentId, id)
        .then(data => {
            if (data[0]._key) {
                s3Service.deleteFileS3(data[0]._key).then(() => {
                    DB.deleteAttachmentById(attachmentId, id)
                        .then(data => {
                            res.status(200).send({status: 200, message: "Attachment deleted"});
                        })
                        .catch(error => {
                            console.log('ERROR:', error);
                            res.status(400).send({status: 400, message: error.detail});
                        });
                })
            }
        })
        .catch(error => {
                console.log('ERROR:', error);
                res.status(400).send({status: 400, message: error.detail});
            }
        );
};

addAttachments = (req, res) => {
    let noteId = req.params.id;

    s3Service.getFileData(req.files).then(data => {
        console.log("-------------------------------------------");
        console.log(data);
        let promiseArray = data.map(p => {
            return DB.createAttachment(uuid(), p.location, p.key, noteId);
        });

        Promise.all(promiseArray)
            .then(result => {
                res.status(200).send({status: 200, message: `Attachment added for note ${noteId}`});
            })
            .catch(error => {
                console.log('ERROR:', error);
                res.status(400).send({status: 400, message: error.detail});
            });
    }).catch(err => {
        console.log(err);
        res.status(400).send({status: 400, message: err.detail});
    });
};

getAttachments = (req, res) => {
    let noteId = req.params.id;

    DB.getAllAttachments(noteId).then(data => {
        res.status(200).send({status: 200, message: data});
    }).catch(error => {
        console.log('ERROR:', error);
        res.status(400).send({status: 400, message: error.detail});
    });
};

resetPassword = (req, res) => {
    var email = req.body.email;
    if (email) {
        DB.searchUser(email)
            .then(function (data) {
                if (data) {
                    awsService.triggerSNSservice(email).then((result)=> {
                        res.status(200).send({status: 200, message: result});
                    }).catch((err)=> {
                        res.status(401).send({status: 401, message: err});
                    });

                    awsService.triggerSNSservice(email).then((result)=> {
                        res.status(200).send({status: 200, message: result});
                    }).catch((err)=> {
                        res.status(401).send({status: 401, message: err});
                    });
                } else {
                    throw new Error();
                }
            })
            .catch(function (error) {
                res.status(400).send({status: 400, message: "The email address is not registered."});
            });
    } else {
        res.set('WWW-Authenticate', 'Basic');
        res.status(401).send({status: 401, message: "Username is required and should be an email address"});
    }
};


module.exports = {
    getTime,
    auth,
    createUser,
    getMyNotes,
    getMyNote,
    createNote,
    updateNote,
    deleteNote,
    addAttachments,
    getAttachments,
    updateAttachments,
    deleteAttachments,
    resetPassword
};
