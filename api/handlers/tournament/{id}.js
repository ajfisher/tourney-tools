'use strict';
var dataProvider = require('../../data/tournament/{id}.js');
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
     */
    get: function getTournamentByID(req, res, next) {
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
    }
};
