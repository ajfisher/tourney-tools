'use strict';

const async = require('async');

const Match = require("../models/match");
const Tournament = require("../models/tournament");

module.exports.put = (event, context, callback) => {
  // this handler deals with the completion of a round
  // It checks all of the tournmanent info passed across
  // checks you have permission to update it
  // then sets the matches to have specific team allocations etc.


  // If tournament ID not matched then 404
  // If tournament secret then 401
  // If match ID not matched then 404
  //
  let tournament_id = null;
  let round_type = null;
  let secret = null;

  let response = {};
  let matches = [];

  let body = JSON.parse(event.body);

  // check if we even got an ID sent through.
  if (typeof(event.pathParameters['id']) === 'undefined') {
    response = {
      statusCode: 404,
      body: JSON.stringify({ msg: "Tournament not found"}),
    };

    callback(null, response);
  } else {
    tournament_id = event.pathParameters.id;
  }

  if (typeof(event.pathParameters['round_type']) === 'undefined') {
    response = {
      statusCode: 404,
      body: JSON.stringify({ msg: "No round type found"}),
    };

    callback(null, response);
  } else {
    round_type = event.pathParameters.round_type;

    // we know we got a round type but is it real
    if (! ['group16', 'quarter', 'semi', 'final'].includes(round_type) ){
      response = {
        statusCode: 404,
        body: JSON.stringify({ msg: "Round type not valid"}),
      };

      callback(null, response);
    }
  }

  // check if we have a secret we're able to use.
  if (typeof(event.headers["X-Tournament-Secret"]) === 'undefined' &&
    typeof(event.headers["x-tournament-secret"]) === 'undefined') {
    response = {
      statusCode: 401,
      body: JSON.stringify({msg: "You cannot update this tournament"}),
    };
    callback(null, response);
  } else {
    secret = event.headers["x-tournament-secret"] || event.headers["X-Tournament-Secret"];
  }

  if (typeof(body.matches) === 'undefined') {
    response = {
      statusCode: 422,
      body: JSON.stringify({msg: "Match details were not supplied"}),
    };
    callback(null, response);
  } else {
    matches = body.matches;
  }

  // Authenticat and then start updating matches
  Tournament.authenticate(tournament_id, secret, (authed) => {

    if (! authed) {
      // do auth check
      response = {
        statusCode: 401,
        body: JSON.stringify({msg: "You do not have permission to update this tournament"})
      };
      callback(null, response);
    } else {

      // set up a task processor to update all of the matches
      // then queue them all up.
      let q = async.queue((match, cb) => {

        Match.get({id: match.id}).then((m) => {

          m.determined = true;
          m.teams = match.teams;
          m.result = {
            win: null,
            lose: null,
            draw: null,
            resulted: false,
          };

          m.save((err) => {
            if (err) {
              console.log("save error");
              cb(err);
            } else {
              cb();
            }
          });

        }).catch((err) => {
          console.log("error finding match");
          cb(err);
        });

      }, 2);

      q.drain = (err) => {
        console.log("all items finished");
        if (err) {
          response = {
            statusCode: 500,
            body: JSON.stringify({msg: "Server error", error: err}),
          };
        } else {
          response = {
            statusCode: 200,
            body: JSON.stringify({msg: "Matches updated correctly"}),
          }
        }

        callback(null, response);
      };

      matches.forEach((match) => q.push(match));
    }
  });
};
