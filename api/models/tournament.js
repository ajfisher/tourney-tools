'use strict';
const crypto = require('crypto');
const shortid = require('shortid');

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

let tournamentSchema = new Schema({
    id: {
        type: String,
        default: shortid.generate,
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
        required: true,
        default: () => {
            return crypto.randomBytes(20).toString('hex');
        },
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
    finals_required: {
        type: [String],
        required: true,
        default: ["semi", "final"],
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

tournamentSchema.statics.authenticate = function(id, secret, cb) {
    // checks the provided id and secret key and returns true / false depending
    // on if correct or not.
    //
    this.query('id').eq(id).and().filter('secret').eq(secret).exec((err, matches) => {

        if (err) cb(false);
        cb (matches.count === 1);
    });
};

let Tournament = dynamoose.model('Tournament',tournamentSchema, options);

module.exports = Tournament;

