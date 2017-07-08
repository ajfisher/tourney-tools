'use strict';

// get the config from the environment or set as basic
//
let aws_creds = {
    accessKeyId: process.env.AWS_ACCESS_KEY || 'AKID',
    secretAccessKey: process.env.AWS_SECRET || 'SECRET',
    region: process.env.AWS_REGION || 'us-east-1',
};


module.exports = {
    aws: aws_creds,
};
