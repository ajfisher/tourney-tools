'use strict';

const Team = require("../models/team");
const Tournament = require("../models/tournament");

module.exports.put = (event, context, callback) => {
  // this handler allows a team to be updated.

  let team_id = null;
  let secret = null;
  let response = {};
  let team = {};

  let body = JSON.parse(event.body);

  // check if we even got an ID sent through.
  if (typeof(event.pathParameters['id']) === 'undefined') {
    response = {
      statusCode: 404,
      body: JSON.stringify({ msg: "Team not found"}),
    };

    callback(null, response);
  } else {
    team_id = event.pathParameters.id;
  }

  // check if we have a secret we're able to use.
  if (typeof(event.headers["X-Tournament-Secret"]) === 'undefined' &&
   typeof(event.headers["x-tournament-secret"]) === 'undefined') {
    response = {
      statusCode: 401,
      body: JSON.stringify({msg: "You cannot update this team"}),
    };
    callback(null, response);
  } else {
    secret = event.headers["x-tournament-secret"] || event.headers["X-Tournament-Secret"];
  }


  if (typeof(body.name) === 'undefined') {
    response = {
      statusCode: 422,
      body: JSON.stringify({msg: "Team details were not supplied"}),
    };
    callback(null, response);
  } else {
    team = body;
  }

  // request the match and make sure we get it.
  Team.get({id: team_id})
    .then((t) => {

      // ensure we can update it by authenticating
      Tournament.authenticate(t.tournament, secret, (authed) => {

        if (! authed) {
          response = {
            statusCode: 401,
            body: JSON.stringify({msg: "You do not have permission to update this team"})
          };
          callback(null, response);
        } else {

          // now we finally know we can update the object
          t.name = team.name;
          t.members = team.members;
          t.avatar = team.avatar || "";

          t.save((err) => {
            if (err) {
              response = {
                statusCode: 500,
                body: JSON.stringify({msg: "Error saving team data"})
              };
            } else {
              response = {
                statusCode: 200,
                body: JSON.stringify(t)
              };
            }
            callback(null, response);
          });
        }
      });

    }).catch((err) => {

      // there wasn't a team for the ID so return 404
      console.log(err);
      response = {
        statusCode: 404,
        body: JSON.stringify({msg: "Cannot find team: " + match_id }),
      }

      callback(null, response);
    });
};
