const DB = require('../routes/db');
const bcrypt = require('bcrypt');
const basicAuth = require('basic-auth');

function getTime(req, res) {
    res.status(200).send(new Date());
}

function createUser(req, res) {
  
    var username = req.body.username;
    var password = req.body.password;

    var emailCheck = validateEmail(username);
    var passwordFormatCheck = enforcePassword(password);

    password = hash(password);

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

function hash(password){
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
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

    const auth = req.get("authorization");

    if (auth) {
        let user = Buffer.from(auth.split(" ").pop(), "base64").toString("ascii").split(":");
        if (!user[0])
            if (!user[1])
                return unauthorized(res);

        var promise = DB.checkUser(user[0],hash(user[1]));
        promise.then(function(value){
            if(value){
                console.log('search success!');
                next();
            }
            else{
                console.log('search fail');
                return res.status(400).send("Invalid credentials");
            }
        });

        // let sql = 'SELECT * FROM users WHERE username="' + user[0] + '"';
        // DB.query(sql, function (err, result) {
        //     if (err) {
        //         console.log('[INSERT ERROR] - ', err.message);
        //         return;
        //     }
        //     if (!result[0])
        //         return res.status(400).send("Invalid credentials");;
        //     if (result[0].password === user[1])
        //         next();
        //     else return res.status(400).send("Invalid credentials");
        // });
    } else {
        return unauthorized(res);
    }
}


module.exports = {
    getTime,
    auth,
    createUser
};