const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { S3BUCKET } = require('../config')[process.env.NODE_ENV];
const fs = require('fs');

getFileData = (files) => {
    console.log(files);
    return new Promise((res, rej) => {
        let fileData;
        console.log("111111111111111111");
        console.log(process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'dev') {
            let promiseArray = files.map(f => {
                let params = { Bucket: S3BUCKET, Key:`${Date.now()}-${f.originalname}`, Body: f.buffer };
                console.log(params);
                return s3.upload(params).promise();
            });

            Promise.all(promiseArray).then(result => {
                fileData = result.map(file => { return {"location":file.Location, "key":file.Key}});
                console.log('S3 data ->', fileData);
                res(fileData);
            }).catch(err=>
                rej(err)
            );
        } else if (process.env.NODE_ENV === 'default') {
            fileData = files.map(file => { return {"location":file.path, "key":file.filename}});
            console.log('Local data ->', fileData);
            res(fileData);
        }
    });
};

updateFile = (data, file) => {

    return new Promise((res, rej) => {

        if (process.env.NODE_ENV === 'dev') {

            let params = { Bucket: S3BUCKET, Key: data.key, Body: file.buffer };

            let result = s3.upload(params).promise();

            result.then(result => {
                let resultData =  {"location":result.Location, "key":result.Key};
                console.log('Filedata', resultData)
                res(resultData);
            }).catch(err=>
                rej(err)
            );

        } else if (process.env.NODE_ENV === 'default') {
            deleteFileS3(data.key).then(() => {
                fileData =  {"location":file.path, key: data.key};
                console.log('Filedata', fileData)
                res(fileData);
            })
        }
    });
}

deleteFileS3 = (key) => {
    return new Promise((res, rej) => {
        if (process.env.NODE_ENV === 'dev') {
            let params = {Bucket: S3BUCKET, Key: key};
            let result = s3.deleteObject(params).promise();

            result.then(result => res()).catch(err=>rej(err));

        } else if (process.env.NODE_ENV === 'default') {
            if (fs.existsSync(`uploads/${key}`)) {
                fs.unlink(`uploads/${key}`, (err) => {
                    if (err) rej(err);
                    else res();
                });
            } else {
                res();
            }
        }
    });
}

module.exports = {
    getFileData,
    updateFile,
    deleteFileS3
}