'use strict';
var Mockgen = require('./mockgen.js');
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
     * operationId: findTournaments
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/tournament',
                operation: 'get',
                response: '200'
            }, callback);
        }
    },
    /**
     * summary: Creates a new tournament
     * description: 
     * parameters: tournament
     * produces: 
     * responses: 200
     * operationId: addTournament
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/tournament',
                operation: 'post',
                response: '200'
            }, callback);
        }
    }
};
