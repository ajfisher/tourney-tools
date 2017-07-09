'use strict';

const Match = require("../models/match");

module.exports.get = (event, context, callback) => {

    let id = null;
    // check if we even got an ID sent through.
    if (typeof(event.pathParameters['id']) === 'undefined') {
        const response = {
            statusCode: 404,
            body: JSON.stringify({ msg: "Match not found"}),
        };

        callback(null, response);
    } else {
        id = event.pathParameters.id;
    }

    Match.get({id: id})
    .then((m) => {

        let response = {};

        if (typeof(m) === 'undefined') {
            response =  {
                statusCode: 404,
                body: JSON.stringify({ msg: `Match ${id} not found`}),
            };

        } else {

            response = {
                statusCode: 200,
                body: JSON.stringify(m),
            };
        }

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
};

