const DB = require('../routes/db');
const basicAuth = require('basic-auth');

// For assignment 3
function listNotes(req, res) {
    auth(req, res, getMyNotes(req, res));
}

function getMyNotes(req, res) {
    var idPromise = db.getIdByUsername(req.body.username);

    idPromise.then(function(id) {// value is id
        if(id){
            var notesPromise = db.getNotesById(id);

            notesPromise.then(function(notes) {
                if(notes){
                    console.log('search success!');
                    res.status(200).send(true);
                }
                else{
                    console.log('search fail!');
                    res.status(200).send(false);
                }}
            );

        }
        else{
            console.log('search fail');
            return res.status(400).send({
                status:400,
                message:"No user id can be got"
            });
        }

    });

}


function updateNote(req, res) {
    //TODO
}

function getNote(req, res) {
    auth(req, res, getMyNote(req, res));
}

function getMyNote(req, res) {
    let id = req.params.id;
    var userId = req.body.id;
    var notePromise = db.getNoteByNoteId(id, userId);


    notePromise.then(function (note) {
        if (note) {
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

function createNote(req, res) {
    //TODO
}

function deleteNote(req, res) {
    //TODO
}





function getTime(req, res) {
    res.status(200).send({
        status:200,
        message:new Date()
    });
}

function createUser(req, res) {
  
    var username = req.body.username;
    var password = req.body.password;

    var emailCheck = validateEmail(username);
    var passwordFormatCheck = enforcePassword(password);


    if(emailCheck) {
        if (passwordFormatCheck) {
              var promise = DB.searchUser(username);
              promise.then(function(value){
                if(value){
                  console.log('search success!');
                  return res.status(400).send("User exists");
                }
                else{
                  console.log('search fail');
                  var promise = DB.createUser(username,password);
                  promise.then(function(value){
                    if(value){
                      console.log('insert success!');
                      res.status(200).send(true);
                    }
                    else{
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
    }


    else return res.status(400).send({
        status: 400,
        message:"Bad request: username is not an email"
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
            status:401,
            message:"You haven't logged in. Authorization Required."
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

        var promise = DB.checkUser(user[0],DB.bcrypthash(user[1]));
        promise.then(function(value){
            if(value){
                console.log('search success!');
                authorized(res);
                return next();
            }
            else{
                console.log('search fail');
                return res.status(400).send({
                    status:400,
                    message:"Invalid credentials"
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
    listNotes,
    getNote,
    getMyNotes,
    getMyNote


};