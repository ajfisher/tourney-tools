'use strict';

const app_config = require('../config');

const dynamoose = require('dynamoose');
dynamoose.AWS.config.update(app_config.aws);

const Schema = dynamoose.Schema;

dynamoose.local(app_config.aws.db);

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
    type: {
        type: String,
        default: "group",
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
        required: true,
        default: [],
    },
    placeholder: {
        type: [String],
        required: false,
    }
});

let Match = dynamoose.model('Match', matchSchema, options);

module.exports = Match;
