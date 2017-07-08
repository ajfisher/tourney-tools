'use strict';

const app_config = require('../config');

const dynamoose = require('dynamoose');
dynamoose.AWS.config.update(app_config.aws);

const Schema = dynamoose.Schema;

dynamoose.local();

const options = {
    create: true,
    udpate: true,
    timestamps: true,
};

const teamSchema = new Schema({
    id: {
        type: String,
        hashKey: true,
        index: {
            global: true,
            rangeKey: 'tournament',
            name: 'TournamentRangeIndex',
        },
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    tournament: {
        type: String,
        required: true,
    },
});


let Team = dynamoose.model('Team', teamSchema, options);

module.exports = Team;
