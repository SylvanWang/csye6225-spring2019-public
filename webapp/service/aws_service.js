const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { S3BUCKET } = require('../config')[process.env.NODE_ENV];
const fs = require('fs');

getFileData = (files) => {
    return new Promise((res, rej) => {
        let fileData;
        if (process.env.NODE_ENV === 'dev') {
            let promiseArray = files.map(f => {
                let params = {Bucket: S3BUCKET, Key: `${Date.now()}-${f.originalname}`, Body: f.buffer};
                return s3.upload(params).promise();
            });

            Promise.all(promiseArray).then(result => {
                fileData = result.map(file => {
                    return {"location": file.Location, "key": file.Key}
                });
                res(fileData);
            }).catch(err =>
                rej(err)
            );

        } else if (process.env.NODE_ENV === 'default') {
            fileData = files.map(file => {
                return {"location": file.path, "key": file.filename}
            });
            res(fileData);
        }
    });
};

updateFile = (data, file) => {

    return new Promise((res, rej) => {

        if (process.env.NODE_ENV === 'dev') {


            let params1 = {Bucket: S3BUCKET, Key: data[0]._key};
            let params = {Bucket: S3BUCKET, Key: `${Date.now()}-${file.originalname}`, Body: file.buffer};

            let result1 = s3.deleteObject(params1).promise();
            let result = s3.upload(params).promise();

            result.then(result => {
                let resultData = {"location": result.Location, "key": result.Key};
                res(resultData);
            }).catch(err =>
                rej(err)
            )

        } else if (process.env.NODE_ENV === 'default') {
            deleteFileS3(data[0]._key).then(() => {
                fileData = {"location": file.path, key: `${Date.now()}-${file.originalname}`};
                res(fileData);
            })
        }
    });
};

deleteFileS3 = (key) => {
    return new Promise((res, rej) => {
        if (process.env.NODE_ENV === 'dev') {
            let params = {Bucket: S3BUCKET, Key: key};
            let result = s3.deleteObject(params).promise();
            result.then(result => res()).catch(err => rej(err));
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

triggerSNSservice = (email) => {
    return new Promise((res, rej) => {
        let sns = new AWS.SNS({ region: "us-east-1" });

        let getTopic = sns.listTopics({}).promise();

        getTopic
            .then(data => {
                console.log("aws sns data: " + data);
                console.log(data);
                data.Topics.forEach(t => {
                    if (t.TopicArn.includes("password_reset")) {
                        let params = {
                            Message: email,
                            TargetArn: t.TopicArn
                        };
                        sns.publish(params, function(err, data) {
                            if (err) {
                                console.log(err, err.stack);
                                rej(err);
                            } else {
                                console.log(data);
                                res(data);
                            }
                        });
                    }
                });
            }).catch(err => {
            console.log(err);
            rej(err);
        });
    });
};

module.exports = {
    getFileData,
    updateFile,
    deleteFileS3,
    triggerSNSservice
};