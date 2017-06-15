// match data fixture
import _ from 'lodash';
import uuid from 'uuid';

// this is scaffolding for test fixtures

const pools = [
    {
        id: "pwcpoola",
        teams: ["pwc1", "pwc2", "pwc3", "pwc4", "pwc5"],
    },
    {
        id: "pwcpoolb",
        teams: ["pwc6", "pwc7", "pwc8", "pwc9", "pwc10"],
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
                determined: true,
                teams: [teams[i], teams[j]],
                result: {
                    resulted: false,
                    win: null,
                    lose: null,
                    draw: null,
                },
            };

            matches.push(match);
        }
    }
});

// shuffle the matches in place using Durstenfeld
for (let i = matches.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = matches[i];
    matches[i] = matches[j];
    matches[j] = temp;
}

export default matches;
