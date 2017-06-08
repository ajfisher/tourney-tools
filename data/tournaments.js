'use strict';

const _ = require('lodash');

let tournaments = [
    {
        id: "abcdef",
        key: "ABC123",
        official: "Andrew Fisher",
        name: "Test Tournament amongst peeps",
        date: "20170527",
    },
];

tournaments.findById = function(id) {
    // take the ID of the tournament and return appropriate object

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
    {
        id: "b1",
        name: "Team B1",
        avatar: "https://example.com/imageurl",
        members: ["B1_1", "B1_2", "B1_3"],
    },
    {
        id: "b2",
        name: "Team B2",
        avatar: "https://example.com/imageurl",
        members: ["B2_1", "B2_2", "B2_3"],
    },
    {
        id: "b3",
        name: "Team B3",
        avatar: "https://example.com/imageurl",
        members: ["B3_1", "B3_2", "B3_3"],
    },
    {
        id: "b4",
        name: "Team B4",
        avatar: "https://example.com/imageurl",
        members: ["B4_1", "B4_2", "B4_3"],
    },
];

tournaments[0].teams = teams;

let pools = [
    {
        id:"poola",
        tournament_id: "abcdef",
        teams: ["a1", "a2", "a3", "a4"],
    },
    {
        id:"poolb",
        tournament_id: "abcdef",
        teams: ["b1", "b2", "b3", "b4"],
    },
];

tournaments[0].pools = pools;

module.exports = {
    tournaments: tournaments,
    teams: teams,
    pools: pools,
}
