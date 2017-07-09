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

let tournamentSchema = new Schema({
    id: {
        type: String,
        hashKey: true,
    },
    name: {
        type: String,
    },
    official: {
        type: String,
    },
    secret: {
        type: String,
    },
    date: {
        type: Date,
    },
    rounds_finished: {
        type: Object,
        required: true,
        default: {
            prelim: false,
            semi: false,
            final: false,
        },
    },
    pools: {
        type: 'list',
        list: [{
            id: {
                type: String,
                required: true,
            },
            teams: {
                type: [String],
                required: true,
            },
        }],
    }
});

let Tournament = dynamoose.model('Tournament',tournamentSchema, options);

module.exports = Tournament;

