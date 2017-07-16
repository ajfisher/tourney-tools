'use strict';
const async = require('async');
const Moment = require('moment');
const shortid = require('shortid');

const Match = require("../models/match");
const Team = require("../models/team");
const Tournament = require("../models/tournament");

const pool_sizes = [
    { no_pools: 1, team_min: 3, team_max: 5, },
    { no_pools: 2, team_min: 6, team_max: 11, },
    { no_pools: 4, team_min: 12, team_max: 23, },
    { no_pools: 8, team_min: 24, team_max: 48, },
];

const final_rounds = {
    "1": ["final"],
    "2": [ "semi", "final", ],
    "4": [ "quarter", "semi", "final" ],
    "8": [ "round16", "quarter", "semi", "final" ]
}

module.exports.post = (event, context, callback) => {
    // this handler looks after the creation of the tournament.

    let response = {};
    let formdata = {};

    if (typeof(event.body) === undefined) {
        response = {
            statusCode: 400,
            body: JSON.stringify({msg: "Please supply complete tournament object"}),
        }
    } else {
        formdata = JSON.parse(event.body);

        let tournament = new Tournament({
            name: formdata.name,
            official: formdata.official,
            date: parseInt(Moment(formdata.date).format('x'))
        });

        let no_teams = parseInt(formdata.no_teams);

        tournament.save((err) => {

            if (err) {
                console.log(err);

                response = {
                    statusCode: 500,
                    body: JSON.stringify({msg: "Error creating tournament", error: err}),
                };

                callback(null, response);
            }

            // now we have a tournament, we need to add the requisite number
            // of teams but we need to also store the IDs that come back into
            // a list so we can create matches and pools too
            let teams = [];

            let q = async.queue((index, cb) => {

                let team = new Team({
                    name: "Team " + index,
                    tournament: tournament.id,
                });

                team.save((err) => {
                    if (err) {
                        console.log(err);
                        cb(err);
                    } else {
                        teams.push(team);
                        cb();
                    }
                });
            }, 4);

            // add the teams to the queue to process
            for (let i = 0; i < no_teams; i++) {
                q.push(i);
            }

            let mq = async.queue((match_data, cb) => {

                let placeholder = [];
                let teams = [];
                let determined = true;

                if (match_data.type === 'group') {
                    teams = [match_data.team_a, match_data.team_b];
                } else {
                    determined = false;
                    placeholder = [match_data.team_a, match_data.team_b];
                }

                let match = new Match({
                    teams: teams,
                    tournament: tournament.id,
                    pool: match_data.pool,
                    determined: determined,
                    placeholder: placeholder,
                    type: match_data.type,
                });

                // save and then call back
                match.save((err) => {
                    if (err) {
                        console.log("There was an error saving match");
                        console.log(match);
                        console.log(err);
                        cb(err);
                    } else {
                        cb();
                    }
                });
            }, 4);

            // once all the teams are completed then we do this process
            q.drain = (err) => {
                if (err) {
                    console.log(err);
                    response = {
                        statusCode: 500,
                        body: JSON.stringify({msg: "error with server", error: err}),
                    }
                } else {

                    // work out the number of pools we need
                    let no_pools = 1;
                    pool_sizes.forEach((pool) => {
                        if (teams.length >= pool.team_min
                                && teams.length <= pool.team_max) {
                            no_pools = pool.no_pools;
                        }
                    });

                    // now allocate the pools, generate ids and then
                    // allocate teams into each of the pools.
                    let pools = [];

                    for (let i = 0; i < no_pools; i++) {
                        let pool = {
                            id: "pool" + String.fromCharCode(65+i),
                            teams: [],
                        }
                        pools.push(pool);
                    }

                    teams.forEach((team, j) => {
                        pools[j % no_pools].teams.push(team.id);
                    });

                    tournament.pools = pools;

                    // now allocate the finals that we need for the whole
                    // tournament to function
                    tournament.finals_required = final_rounds["" + no_pools];

                    tournament.rounds_finished = {
                        prelim: false,
                    };

                    tournament.finals_required.forEach((round) => {
                        tournament.rounds_finished[round] = false;
                    });

                    tournament.save((err) => {
                        if (err) {
                            console.log(err);
                            response = {
                                statusCode: 500,
                                body: JSON.stringify({msg: "error saving tournament", error: err}),
                            };
                            callback(null, response);
                        } else {

                            // we now need to queue the creation of all of the
                            // matches.
                            pools.forEach((pool) => {

                                for (let i = 0; i < pool.teams.length; i++) {

                                    let team_a = pool.teams[i];
                                    for (let j = i+1; j< pool.teams.length; j++) {
                                        let team_b = pool.teams[j];

                                        let match_data = {
                                            pool: pool.id,
                                            team_a: team_a,
                                            team_b: team_b,
                                            type: "group",
                                        };

                                        mq.push(match_data);
                                    }
                                }
                            });

                            tournament.finals_required.forEach((final) => {

                                console.log("final type", final);

                                if (final === "final") {
                                    mq.push({
                                        type: final,
                                        team_a: "Semi Final 1 Winner",
                                        team_b: "Semi Final 2 Winner",
                                    });
                                } else if (final === "semi") {
                                    // if we're 2 pools then we take group stage,
                                    mq.push({
                                        type: final,
                                        team_a: (no_pools === 2) ? "Group A Winner": "QF 1 Winner",
                                        team_b: (no_pools === 2) ? "Group B Runner Up" : "QF 2 Winner",
                                    });

                                    mq.push({
                                        type: final,
                                        team_a: (no_pools === 2) ? "Group B Winner" : "QF 3 Winner",
                                        team_b: (no_pools === 2) ? "Group A Runner Up" : "QF 4 Winner",
                                    });
                                } else if (final === "quarter") {
                                    // if we're 4 pools then take group stage
                                    mq.push({
                                        type: final,
                                        team_a: (no_pools === 4) ? "Group A Winner": "Round 16 1 Winner",
                                        team_b: (no_pools === 4) ? "Group B Runner Up" : "Round 16 2 Winner",
                                    });
                                    mq.push({
                                        type: final,
                                        team_a: (no_pools === 4) ? "Group B Winner": "Round 16 3 Winner",
                                        team_b: (no_pools === 4) ? "Group A Runner Up" : "Round 16 4 Winner",
                                    });
                                    mq.push({
                                        type: final,
                                        team_a: (no_pools === 4) ? "Group C Winner": "Round 16 5 Winner",
                                        team_b: (no_pools === 4) ? "Group D Runner Up" : "Round 16 6 Winner",
                                    });
                                    mq.push({
                                        type: final,
                                        team_a: (no_pools === 4) ? "Group D Winner": "Round 16 7 Winner",
                                        team_b: (no_pools === 4) ? "Group C Runner Up" : "Round 16 8 Winner",
                                    });
                                }
                                // TODO Add scenario for R16 set up too.
                            });
                        }
                    });
                }
            };

            // this is done when all the matches have been created and is
            // the final thing we do before passing back
            mq.drain = (err) => {
                if (err) {
                    console.log(err);
                    response = {
                        statusCode: 500,
                        body: JSON.stringify({msg: "error saving tournament", error: err}),
                    };
                } else {
                    // everything is made, let's hand back to the client
                    response = {
                        statusCode: 201,
                        body: JSON.stringify(tournament),
                    };
                }
                callback(null, response);
            };

        });
    }
}


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

