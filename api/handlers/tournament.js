'use strict';

const Tournament = require("../models/tournament");

module.exports.get = (event, context, callback) => {

    console.log("About to get the object");

    Tournament.get(123456)
        .then((t) => {
            console.log("got object, sending back x2");
            console.log(t);
            const response = {
                statusCode: 200,
                body: JSON.stringify(t),
            };
            callback(null, response);
        })
        .catch((err) => {
            console.log("no object, send back 404");
            console.log(err);
            const response = {
                statusCode: 404,
                body: JSON.stringify(err),
            };
            callback(null, response);
        });


    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

