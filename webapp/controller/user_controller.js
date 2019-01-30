const DB = require('../routes/db');
const bcrypt = require('bcryptjs');
const basicAuth = require('basic-auth');

function getTime(req, res) {
    res.status(200).send(new Date());
}

function createUser(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var sql = 'INSERT INTO users(username,password) VALUES("' + username + '","' + password + '")';

    DB.query(sql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        console.log(result);
        res.status(200).send(result);
        console.log('-----------------------------------------------------------------\n\n');
    });
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

        let sql = 'SELECT * FROM users WHERE username="' + user[0] + '"';
        DB.query(sql, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            if (!result[0])
                return res.status(400).send("Invalid credentials");;
            if (result[0].password === user[1])
                next();
            else return res.status(400).send("Invalid credentials");
        });
    } else {
        return unauthorized(res);
    }
}


module.exports = {
    getTime,
    auth,
    createUser
};