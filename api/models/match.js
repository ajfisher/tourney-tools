'use strict';

const dynamoose = require('dynamoose');
const uuid = require('uuid/v4');

const app_config = require('../config');

dynamoose.AWS.config.update(app_config.aws);

const Schema = dynamoose.Schema;

if (process.env.DDB_REMOTE !== true) {
    dynamoose.local(app_config.aws.db);
}

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
        default: uuid,
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
