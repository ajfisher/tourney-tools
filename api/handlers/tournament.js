'use strict';

const Match = require("../models/match");
const Team = require("../models/team");
const Tournament = require("../models/tournament");

module.exports.get = (event, context, callback) => {

    let id = null;
    let secret = null;

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

    // check if we have a secret we're able to use which will determine auth
    if (typeof(event.headers["X-Tournament-Secret"]) !== 'undefined') {
        secret = event.headers["X-Tournament-Secret"];
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

            if (secret && (t.secret === secret)) {
                t.authed = true;
            } else {
                t.authed = false;
            }

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


module.exports.get_matches = (event, context, callback) => {

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

    Match.scan("tournament").eq(id).exec((err, matches) => {

        let response = {};

        if (err) {
            response =  {
                statusCode: 404,
                body: JSON.stringify({ msg: "Matches not found"}),
            };

        } else {

            response = {
                statusCode: 200,
                body: JSON.stringify(matches),
            };
        }

        callback(null, response);
    })
};

