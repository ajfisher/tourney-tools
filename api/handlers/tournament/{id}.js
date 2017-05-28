'use strict';

const tournaments = require('../../../data/tournaments.js').tournaments;

module.exports = {

    get: (req, res) => {

        res.type('application/json');

        let tournament = tournaments.findById(req.params['id']);
        if (typeof(tournament) == 'undefined') {
            res.status(404).json({
                error: "Tournament not found"
            });
        } else {
            res.json(tournaments.findById(req.params['id']));
        }
    },

}

