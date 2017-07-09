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
    useDocumentTypes: true,
};

let matchSchema = new Schema({
    id: {
        type: String,
        hashKey: true,
    },
    tournament: {
        type: String,
        required: true,
    },
    pool: {
        type: String,
    },
    determined: {
        type: Boolean,
        required: true,
        default: false,
    },
    result: {
        type: Object,
        required: true,
        default: {
			resulted: false,
			win: null,
			lose: null,
			draw: null
        },
    },
    teams: {
        type: [String],
        required: false,
    },
    placeholder: {
        type: [String],
        required: false,
    }
});

let Match = dynamoose.model('Match', matchSchema, options);

module.exports = Match;
