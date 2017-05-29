'use strict';
var dataProvider = require('../data/tournament.js');
/**
 * Operations on /tournament
 */
module.exports = {
    /**
     * summary: Returns all of the tournaments in the system
     * description: 
     * parameters: 
     * produces: 
     * responses: 200
     */
    get: function findTournaments(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    },
    /**
     * summary: Creates a new tournament
     * description: 
     * parameters: tournament
     * produces: 
     * responses: 200
     */
    post: function addTournament(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['post']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
