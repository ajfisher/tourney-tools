'use strict';

const _ = require('lodash');

let tournaments = [
    {
        id: "abcdef",
        key: "ABC123",
        official: "Andrew Fisher",
        name: "Test Tourney",
        date: "20170527",
    },
];

tournaments.findById = function(id) {
    // take the ID of the tournament and return appropraite object

    let tournament = {};

    if (typeof(id) != undefined) {
        tournament = _.find(tournaments, {id: id});
    }

    return tournament;
};


const teams = [
    {
        id: "a1",
        name: "Team A1",
        avatar: "https://example.com/imageurl",
        members: ["A1_1", "A1_2", "A1_3"],
    },
    {
        id: "a2",
        name: "Team A2",
        avatar: "https://example.com/imageurl",
        members: ["A2_1", "A2_2", "A2_3"],
    },
    {
        id: "a3",
        name: "Team A3",
        avatar: "https://example.com/imageurl",
        members: ["A3_1", "A3_2", "A3_3"],
    },
    {
        id: "a4",
        name: "Team A4",
        avatar: "https://example.com/imageurl",
        members: ["A4_1", "A4_2", "A4_3"],
    },
];

tournaments[0].teams = teams;

module.exports = {
    tournaments: tournaments,
    teams: teams,
}
