const DB = require('../routes/db');
const basicAuth = require('basic-auth');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple'); 

function getTime(req, res) {
    res.status(200).send(new Date());
}

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    DB.getPassword(username).then(target => {
        let encryptedPassword = target;

        isSamePassword(password, encryptedPassword).then(result => {
            console.log('compare res', result);
            if (result) {
                let payload = {
                    "username": username,
                    "password": password
                };
                let resJson = { 
                    'authToken': generateToken(payload) 
                };
                return res.status(200).send(resJson);
            } else {
                return res.status(400).send("Invalid username or password");
            }
        })
    }).catch(e => {
        return res.status(400).send("Invalid username or password");
    })    
}

function generateToken(username) {
    var payload = { username };
    var secret = 'cc';
    var token = jwt.encode(payload, secret);
    return token;
}

function getEncrypted(data) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(data, salt);
    return hash;
}

function isSamePassword(plainPassword, encryptedPassword) {
    return bcrypt.compare(plainPassword, encryptedPassword).then((resBcrypt) => {
        if (resBcrypt) {
            return true;
        } else {
            return false;
        }
    }).catch(e => {
        return false;
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
       } else return res.status(400).send("Bad password: Password has to contain 1. Upper case character 2. Lower case character 3. Numbers from 0-9 4. ON of the Special character $@! 4. Length has to be in 6-12" );

    }
    else return res.status(400).send("Bad request: username is not an email");
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
        return res.status(401).send("You haven't logged in. Authorization Required.");
    }

    const auth = req.get("Authorization");
    console.log("auth token is: " + auth);

    if (auth) {
        let payload = jwt.decode(auth, 'cc') || {};
        let username = payload.username.username || "INVALID";
        let password = payload.username.password || "INVALID";


        console.log('username', username);
        console.log('password', password);

        if (username == "INVALID" || password == "INVALID") {
            return unauthorized(res);
        }

        let sql = 'SELECT * FROM users WHERE username="' + username + '"';
        DB.query(sql, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            if (!result[0]) {
                console.log("WWW>");
                return res.status(400).send("Invalid credentials");
            }

            return isSamePassword(password, result[0].password).then(isSame => {
                if (isSame)
                    next();
                else {
                    console.log("not match");
                    return res.status(400).send("Invalid credentials");
                } 
                    
            })
            
        });
    } else {
        console.log("here");
        return unauthorized(res);
    }
}


module.exports = {
    getTime,
    auth,
    createUser,
    login
};