const express = require('express');
const router = express.Router();
const db = require("./db");
const user = require('../controller/user_controller');

router.get('/', user.getTime);
router.post('/user/register', user.createUser);

module.exports = router;
