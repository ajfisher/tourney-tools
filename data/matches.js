// match data fixture
import _ from 'lodash';
import uuid from 'uuid';

// this is scaffolding for test fixtures

const pools = [
    {
        id: "poola",
        teams: ["a1", "a2", "a3", "a4"],
    },
    {
        id: "poolb",
        teams: ["b1", "b2", "b3", "b4"],
    },
];

let matches = [];

pools.forEach((pool) => {

    const teams = pool.teams;

    for (let i=0; i < teams.length; i++) {

        for (let j=i+1; j < teams.length; j++) {

            let match = {
                id: uuid(),
                pool: pool.id,
                teams: [teams[i], teams[j]],
                result: {
                    resulted: "outstanding",
                    win: null,
                    lose: null,
                },
            };

            matches.push(match);
        }
    }
});

export default matches;
