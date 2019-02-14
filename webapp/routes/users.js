const express = require('express');
const router = express.Router();
const db = require("./db");
const user = require('../controller/user_controller');

router.post('/user/register', user.createUser);
router.use('/', user.auth);
router.get('/', user.getTime);
router.get('/a', db.getIdByUsername);

router.get('/note', user.auth, user.getMyNotes);
router.put('/note/:id', user.updateNote);
router.get('/note/:id', user.auth,user.getMyNote);
router.post('/note', user.createNote);
router.delete('/note/:id', user.deleteNote);
module.exports = router;
