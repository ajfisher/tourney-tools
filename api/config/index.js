'use strict';

const AWS = require('aws-sdk');
// get the config from the environment or set as basic
//

let aws_creds = {};

if (process.env.AWS_PROFILE) {
    let credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
    AWS.config.credentials = credentials;
    aws_creds = AWS.config;
} else {

    aws_creds = {
        accessKeyId: process.env.AWS_ACCESS_KEY || 'AKID',
        secretAccessKey: process.env.AWS_SECRET || 'SECRET',
    };
}

aws_creds.region = process.env.AWS_REGION || 'ap-southeast-2';
aws_creds.db = 'http://localhost:8001';

if (process.env.DDB_LOCAL === 'true') {
    console.log("Local DB env Variable is set");
}

module.exports = {
    aws: aws_creds,
};
