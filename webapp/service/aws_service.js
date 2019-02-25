const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { S3BUCKET } = require('../config')[process.env.NODE_ENV];
const fs = require('fs');

getFileData = (files) => {
    console.log(files);
    return new Promise((res, rej) => {
        let fileData;
        if (process.env.NODE_ENV === 'dev') {
            s3.listBuckets(function(err, data) {
                if (err) {
                    console.log("Error", err);
                } else {

                    let promiseArray = files.map(f => {
                        let params = { Bucket: data.Buckets[0].Name, Key:`${Date.now()}-${f.originalname}`, Body: f.buffer };
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
                }
            });
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

            s3.listBuckets(function(err, bucket) {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("000000000")
                    console.log(file)
                    let params1 = {Bucket: bucket.Buckets[0].Name, Key: data[0]._key};
                    let params = {Bucket: bucket.Buckets[0].Name, Key: `${Date.now()}-${file.originalname}`, Body: file.buffer};

                    let result1 = s3.deleteObject(params1).promise();
                    let result = s3.upload(params).promise();

                    result.then(result => {
                        let resultData = {"location": result.Location, "key": result.Key};
                        console.log('Filedata', resultData)
                        res(resultData);
                    }).catch(err =>
                        rej(err)
                    )
                }
            });

        } else if (process.env.NODE_ENV === 'default') {
            deleteFileS3(data[0]._key).then(() => {
                fileData =  {"location":file.path, key: `${Date.now()}-${file.originalname}`};
                console.log('Filedata', fileData);
                res(fileData);
            })
        }
    });
};

deleteFileS3 = (key) => {
    return new Promise((res, rej) => {
        if (process.env.NODE_ENV === 'dev') {
            s3.listBuckets(function(err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    let params = {Bucket: data.Buckets[0].Name, Key: key};
                    let result = s3.deleteObject(params).promise();

                    result.then(result => res()).catch(err => rej(err));
                }
            });

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
};

module.exports = {
    getFileData,
    updateFile,
    deleteFileS3
};