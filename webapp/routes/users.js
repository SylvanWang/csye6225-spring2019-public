const express = require('express');
const router = express.Router();

const db = require("./db");
const user = require('../controller/user_controller');
const note = require('../controller/user_controller');

const multer  = require('multer');

require('dotenv').config();
const ENV = process.env.NODE_ENV || 'dev';

const config = require('../config')[ENV];
const STORAGE = config.STORAGE;
const SDC = require('statsd-client');
const sdc = new SDC({host: 'localhost', port: 8125});

const docFilter = function (req, file, cb) {
    // accept doc only
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
//var upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: STORAGE, fileFilter: docFilter, preservePath: true });

router.use((req, res, next) => {
    console.log(req.method, req.url);
    sdc.publish=true;
    sdc.increment(req.method+" "+req.url);
    next();
});


router.post('/user/register', user.createUser);
router.get('/', user.auth, user.getTime);
router.get('/a', user.auth, db.getIdByUsername);

router.get('/note', user.auth, user.getMyNotes);
router.put('/note/:id', user.auth, user.updateNote);
router.get('/note/:id', user.auth, user.getMyNote);
router.post('/note', user.auth, user.createNote);
router.delete('/note/:id', user.auth, user.deleteNote);

router.post('/note/:id/attachments', upload.array('attachments', 3), user.addAttachments);
router.get('/note/:id/attachments', user.getAttachments);
router.put('/note/:id/attachments/:attachmentId', upload.single('attachments'), user.updateAttachments);
router.delete('/note/:id/attachments/:attachmentId', note.deleteAttachments);

router.get('/reset/:email', user.resetPassword);

module.exports = router;
