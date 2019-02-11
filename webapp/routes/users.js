const express = require('express');
const router = express.Router();
const db = require("./db");
const user = require('../controller/user_controller');

router.post('/user/register', user.createUser);
router.use('/', user.auth);
router.get('/', user.getTime);

router.get('/note', user.listNotes);
router.put('/note', user.updateNote);
router.get('/note:id', user.getNote);
router.post('/note:id', user.createNote);
router.delete('/note:id', user.deleteNote);
module.exports = router;
