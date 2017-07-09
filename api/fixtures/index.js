'use strict';

const Moment = require('moment');

/**
 * Load all of the models up and drop the data into the DB. Very useful
 * for dev work so we can get a reasonable set of data rapidly
 **/

const Tournament = require('../models/tournament');
const tournament_data = require('./tournaments.json');

tournament_data.forEach((tournament) => {
    // add each of the tournaments to the db.
    //
    tournament.date = parseInt(Moment(tournament.date).format('x'));
    Tournament.create(tournament, (err, t) => {
        if (err) { return console.log(err); }
        console.log("Added Tournament: " + t.id);
    });
});

const Team = require('../models/team');
const team_data = require('./teams.json');

team_data.forEach((team) => {
    // add each of the teams to the db.
    //
    Team.create(team, (err, t) => {
        if (err) { return console.log(err); }
        console.log("Added Team: " + t.id);
    });
});

const Match = require('../models/match');
const match_data = require('./matches.json');

match_data.forEach((match) => {
    // add each of the matches to the db.
    //
    Match.create(match, (err, m) => {
        if (err) { return console.log(err); }
        console.log("Added Match: " + m.id);
    });
});
