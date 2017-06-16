'use strict';

const _ = require('lodash');

let tournaments = [
    {
        id: "pwcmelb",
        key: "ABC123",
        official: "Rhett Richardson / Andrew Fisher",
        name: "PwC STEM Robotics Challenge",
        date: "20170616",
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
        id: "pwc1",
        name: "Asimo",
        avatar: "/asimo.jpg",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc2",
        name: "Bender",
        avatar: "/bender.png",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc3",
        name: "C-3P0",
        avatar: "/c3p0.png",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc4",
        name: "Eva",
        avatar: "/eva.png",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc5",
        name: "Optimus",
        avatar: "/optimus.jpg",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc6",
        name: "R2D2",
        avatar: "/r2d2.jpg",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc7",
        name: "RoboCop",
        avatar: "/robocop.png",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc8",
        name: "Sonny",
        avatar: "/sonny.jpg",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc9",
        name: "Terminator",
        avatar: "/terminator.jpg",
        members: ["1", "2", "3", "4"],
    },
    {
        id: "pwc10",
        name: "Wall-E",
        avatar: "/wall-e.jpg",
        members: ["1", "2", "3", "4"],
    },
];

tournaments[0].teams = teams;

let pools = [
    {
        id:"pwcpoola",
        tournament_id: "pwcmelb",
        teams: ["pwc1", "pwc2", "pwc3", "pwc4", "pwc5"],
    },
    {
        id:"pwcpoolb",
        tournament_id: "pwcmelb",
        teams: ["pwc6", "pwc7", "pwc8", "pwc9", "pwc10"],
    },
];

tournaments[0].pools = pools;

module.exports = {
    tournaments: tournaments,
    teams: teams,
    pools: pools,
}
