'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /tournament/{id}
 */
module.exports = {
    /**
     * summary: Returns the specific tournament
     * description: 
     * parameters: id
     * produces: 
     * responses: 200
     * operationId: getTournamentByID
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/tournament/{id}',
                operation: 'get',
                response: '200'
            }, callback);
        }
    }
};
