'use strict';

const dynamoose = require('dynamoose');
dynamoose.AWS.config.update({
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-east-1'
});

const Schema = dynamoose.Schema;

dynamoose.local();

const options = {
    create: true,
    udpate: true,
};

const tournamentSchema = new Schema({
    id: {
        type: Number,
        hashKey: true,
    },
    name: {
        type: String,
    },
    foo: {
        type: String,
    }
});


let Tournament = dynamoose.model('Tournament',tournamentSchema, options);


if (require.main === module) {

    var demo = new Tournament({id: 123456, name: "test", foo: "Garbage"});

    demo.save();

    console.log("About to retrieve");

    Tournament.get(123456)
        .then((t) => {
            console.log("come back");
            console.log(t);
        });
} else {
    module.exports = Tournament;
}
