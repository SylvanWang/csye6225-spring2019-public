const DB = require('../routes/db');
const bcrypt = require('bcryptjs');


function getTime(req, res) {
    res.send(new Date());
}

function createUser(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var userAddSql = 'INSERT INTO users(username,password) VALUES("' + username +'","' + password + '")';

    DB.query(userAddSql,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        console.log(result);
        res.send(result);
        console.log('-----------------------------------------------------------------\n\n');
    });


/*
    let hash = bcrypt.hashSync(req.body.password, 4);
    var sql = "INSERT INTO users (_id, email, password) VALUES ('Company Inc', 'Highway 37')";

    DB.query('INSERT INTO users(_id, email, password) VALUES($1, $2, $3) RETURNING _id',[uuidv4(), req.body.email, hash])
        .then(data => {
            res.status(200).send(`User ${data.email} successfully created!`);
        })
        .catch(error => {
            console.log('ERROR:', error);
            res.status(400).send(error.detail);
        });
        */
}

function getAllUsers(req, res) {
    var sql = 'SELECT * FROM users';
    DB.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        res.send(result);
    });

}


module.exports = {
    getTime,
    createUser,
    getAllUsers
};