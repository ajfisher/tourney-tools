'use strict';

const Match = require("../models/match");
const Tournament = require("../models/tournament");

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

module.exports.put = (event, context, callback) => {

    // get the ID of the match, ID of the tournament
    // and tournament secret
    // If no match then return 404
    // If tournament ID not matched then 401
    // If tournament secret then 401
    let match_id = null;
    let secret = null;

    let response = {};
    let result = {};

    let body = JSON.parse(event.body);
    console.log(event.body);

    // check if we even got an ID sent through.
    if (typeof(event.pathParameters['id']) === 'undefined') {
        response = {
            statusCode: 404,
            body: JSON.stringify({ msg: "Match not found"}),
        };

        callback(null, response);
    } else {
        match_id = event.pathParameters.id;
    }

    // check if we have a secret we're able to use.
    if (typeof(event.headers["X-Tournament-Secret"]) === 'undefined') {
        response = {
            statusCode: 401,
            body: JSON.stringify({msg: "You cannot update this match"}),
        };
        callback(null, response);
    } else {
        secret = event.headers["X-Tournament-Secret"];
    }

    if (typeof(body.result) === 'undefined') {
        response = {
            statusCode: 422,
            body: JSON.stringify({msg: "Result details were not supplied"}),
        };
        callback(null, response);
    } else {
        result = body.result;
    }

    // request the match and make sure we get it.
    Match.get({id: match_id})
    .then((m) => {

        // ensure we can update it by authenticating
        Tournament.authenticate(m.tournament, secret, (authed) => {

            if (! authed) {
                response = {
                    statusCode: 401,
                    body: JSON.stringify({msg: "You do not have permission to update this match"})
                };
                callback(null, response);
            } else {

                // now we finally know we can update the object
                m.result = result;

                m.save((err) => {
                    if (err) {
                        response = {
                            statusCode: 500,
                            body: JSON.stringify({msg: "Error saving match data"})
                        };
                    } else {
                        response = {
                            statusCode: 200,
                            body: JSON.stringify(m)
                        };
                    }
                    callback(null, response);
                });
            }
        });

    }).catch((err) => {

        // there wasn't a match for the ID so return 404
        console.log(err);
        response = {
            statusCode: 404,
            body: JSON.stringify({msg: "Cannot find match: " + match_id }),
        }

        callback(null, response);
    });
};
