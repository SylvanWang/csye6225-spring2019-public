const multer  = require('multer');
let diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

module.exports = Object.freeze({
    'host':'localhost',
    'password':'root',
    'user':'root',
    'database':'csye_6225',

    default: {
        PORT: process.env.PORT,
        DB_CONNECTION: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.USER_NAME,
            password: process.env.PASS
        },
        STORAGE: diskStorage,
    },
    dev: {
        PORT: process.env.PORT,
        DB_CONNECTION: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.USER_NAME,
            password: process.env.PASS
        },
        STORAGE: multer.memoryStorage(),
        S3BUCKET: process.env.S3BUCKET
    }
});
