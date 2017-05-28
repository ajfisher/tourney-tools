'use strict';

const tournaments = require('../../data/tournaments.js').tournaments;

module.exports = {

    get: (req, res) => {
        res.type('application/json');
        res.json(tournaments);
    },

}
