'use strict';

const AWS = require('aws-sdk');
// get the config from the environment or set as basic

let aws_creds = {};

let create = false;

if (process.env.DDB_REMOTE) {

    console.log("Working out creds");
    // console.log(process.env);
    if (process.env.LAMBDA_TASK_ROOT) {
        aws_creds = AWS.config;
        console.log(aws_creds);
    } else {
        let credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
        AWS.config.credentials = credentials;
        aws_creds = AWS.config;
    }

    if (process.env.DDB_CREATE) {
        console.log("Remote tables creatable");
        create = true;
    }

} else {

    aws_creds = {
        accessKeyId: process.env.AWS_ACCESS_KEY || 'AKID',
        secretAccessKey: process.env.AWS_SECRET || 'SECRET',
    };
    console.log("Using LOCAL DDB");
    create = true;
}

aws_creds.region = process.env.AWS_REGION || 'ap-southeast-2';
aws_creds.db = 'http://localhost:8001';

// console.log(aws_creds);

module.exports = {
    aws: aws_creds,
    create: create,
};
