const express = require('express');
const router = express.Router();
const db = require("./db");
const user = require('../controller/user_controller');

router.post('/user/register', user.createUser);
router.use('/', user.auth);
router.get('/', user.getTime);

module.exports = router;
