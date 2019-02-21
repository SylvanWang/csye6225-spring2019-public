const express = require('express');
const router = express.Router();
const db = require("./db");
const user = require('../controller/user_controller');
const note = require('../controller/user_controller');

const multer  = require('multer');
const ENV = process.env.NODE_ENV || 'dev';

const config = require('../config')[ENV];
const STORAGE = config.STORAGE;
const SDC = require('statsd-client');
const sdc = new SDC({host: 'localhost', port: 8125});

const docFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
        return cb(new Error('Only doc files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ dest: 'uploads/' });
// const upload = multer({ storage: STORAGE, fileFilter: docFilter, preservePath: true });

router.use((req, res, next) => {
    console.log(req.method, req.url);
    sdc.publish=true;
    sdc.increment(req.url);
    next();
});


router.post('/user/register', user.createUser);
router.use('/', user.auth);
router.get('/', user.getTime);
router.get('/a', db.getIdByUsername);

router.get('/note', user.auth, user.getMyNotes);
router.put('/note/:id', user.auth, user.updateNote);
router.get('/note/:id', user.auth, user.getMyNote);
router.post('/note', user.auth, user.createNote);
router.delete('/note/:id', user.auth, user.deleteNote);

//router.post('/note/:id/attachments', upload.single('attachments', 3), user.addAttachments);
router.post('/note/:id/attachments', upload.array('attachments', 3), user.addAttachments);
module.exports = router;
