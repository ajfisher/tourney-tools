'use strict';

const Team = require("../models/team");
const Tournament = require("../models/tournament");

module.exports.get = (event, context, callback) => {

    let id = null;
    // check if we even got an ID sent through.
    if (typeof(event.pathParameters['id']) === 'undefined') {
        const response = {
            statusCode: 404,
            body: JSON.stringify({ msg: "Resource not found"}),
        };

        callback(null, response);
    } else {
        id = event.pathParameters.id;
    }

    Tournament.get({id: id})
    .then((t) => {

        let response = {};

        if (typeof(t) === 'undefined') {
            response =  {
                statusCode: 404,
                body: JSON.stringify({ msg: "Resource not found"}),
            };
            callback(null, response);

        } else {

            // remove the secret key from the message
            t.secret = "";

            // get the team data
            Team.scan('tournament').eq(id).exec((err, teams) => {

                if (! err) {
                    t.teams = teams;
                }
                response = {
                    statusCode: 200,
                    body: JSON.stringify(t),
                };

                callback(null, response);
            });
        }
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

