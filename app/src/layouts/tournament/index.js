import _ from 'lodash';

import React, { Component } from 'react';
import { Container, Grid, Header, Statistic } from 'semantic-ui-react';

// get custom components
import DateFormat from '../../components/date';
import Finals from '../../components/finals';
import Preliminary from '../../components/prelim';
import TeamList from '../../components/teamlist';

// get custom libs
import { load_state, save_state } from '../../lib/localstorage.js'

// get data
import { tournaments } from '../../data/tournaments';
import  matches  from '../../data/matches';


class Tournament extends Component {
    // sets up the Tournament layout

    constructor(props) {
        super(props);
        const id = props.match.params.id;

        let tournament = null;

        const loaded_data = load_state(id);
        // try to get data from localstorage first
        if (loaded_data) {
            console.log("Loading from state");
            tournament = loaded_data;
        } else {
            console.log("Loading from data file");
            tournament = tournaments.findById(id);
            tournament.pool_matches = matches;
        }

        if (typeof(tournament.finals) === "undefined") {
            // add the finals section
            // add finals details.
            tournament.finals = {
                "semi": {
                    matches: [
                        {
                            id: "semi-1",
                            determined: false,
                            result: {
                                resulted: false,
                            },
                            teams: [],
                            placeholder: ["Group A Winner", "Group B Runner Up"],
                        },
                        {
                            id: "semi-2",
                            determined: false,
                            result: {
                                resulted: false,
                            },
                            teams: [],
                            placeholder: ["Group B Winner", "Group A Runner Up"],
                        },
                    ]
                },
                "final": {
                    matches: [
                        {
                            id: "final",
                            determined: false,
                            result: {
                                resulted: false,
                            },
                            teams: [],
                            placeholder: ["Semi Final 1 Winner", "Semi Final 2 Winner"],
                        },
                    ],
                },
            }
        }

        if (typeof(tournament.rounds_finished) === 'undefined') {
            tournament.rounds_finished = {
                prelim: false,
                semi: false,
                final: false,
            };
        }

        this.state = tournament;
    };

    handleResult = (match) => {
        // this occurs when a result gets posted so we want to update the
        // results of the matches.

        let matches = this.state.pool_matches;
        let index = _.findIndex(matches, {'id': match.id});
        matches[index] = match;

        this.setState({pool_matches: matches});

        this.checkRoundComplete(matches, 'prelim');

        // save the data to localstorage for later usage.
        save_state(this.state.id, this.state);
    };

    handleFinalResult = (match, finalType) => {
        // refactor this out as it's a duplicate of above
        //
        let finals = this.state.finals;
        let matches = finals[finalType].matches;
        let index = _.findIndex(matches, {'id': match.id});
        matches[index] = match;
        // update the finals again.
        finals[finalType].matches = matches;

        this.setState({finals: finals});

        this.checkRoundComplete(matches, finalType);

        // save the data to localstorage for later usage.
        save_state(this.state.id, this.state);
    };

    handleTeamChange = (team) => {
        // update the state with the change of the team data
        let teams = this.state.teams;
        let teamindex = _.findIndex(teams, {id: team.id});
        teams[teamindex] = team;

        this.setState({teams: teams});

        save_state(this.state.id, this.state);
        //TODO CALL API to update here.
    }

    checkRoundComplete(matches, round_type) {
        // now we need to check if all the matches have resulted.
        let result_count = _.reduce(matches, (result, value) => {
            return result + (value.result.resulted ? 1 : 0);
        }, 0);

        if (result_count === matches.length) {
            let { rounds_finished } = this.state;
            rounds_finished[round_type] = true;
            this.setState({ rounds_finished: rounds_finished});

            // now we need to advance the round. To do that we need
            // to know the original round (round type) the next round
            // and the team list and the matches to derive the next lot
            // probably just shortcut this for the moment.
            this.advanceRound(round_type);
        }

        save_state(this.state_id, this.state);
    }

    advanceRound(round_type) {

        if (round_type === "prelim") {
            const pools = this.state.pools;
            const matches = this.state.pool_matches;

            let semi_list = [];

            _.forEach(pools, (pool) => {

                let team_results = _.map(pool.teams, (teamid, index) => {

                    let team_matches = _.filter(matches, (match) => {
                        return ( match.teams.includes(teamid) && match.result.resulted);
                    });

                    let teamdata = {
                        id: teamid,
                        wins: _.reduce(team_matches, (result, value) => {
                            if (value.result.win === teamid) {
                                return result + 1;
                            } else {
                                return result;
                            }
                        }, 0),
                        losses: _.reduce(team_matches, (result, value) => {
                            if (value.result.lose === teamid) {
                                return result + 1;
                            } else {
                                return result;
                            }
                        }, 0),
                        draws: _.reduce(team_matches, (result, value) => {
                            if (value.result.draw) {
                                return result + 1;
                            } else {
                                return result;
                            }
                        }, 0),
                    };

                    teamdata.points = (teamdata.wins * 3) +
                        (teamdata.losses * 1) +
                        (teamdata.draws * 2);

                    return teamdata;

                });

                // now we have team_results for the pool.
                team_results = _.orderBy(team_results, 'points', 'desc');

                semi_list.push( {
                    winner: team_results[0].id,
                    runner: team_results[1].id,
                });
            });

            // now update the matches for the semi
            let finals = this.state.finals;

            for (let i=0; i< finals.semi.matches.length; i++) {

                finals.semi.matches[i].determined = true;
                finals.semi.matches[i].teams.push(semi_list[i].winner);
                // do this so we swap them around.
                if (i % 2 === 0) {
                    finals.semi.matches[i].teams.push(semi_list[i+1].runner);
                } else {
                    finals.semi.matches[i].teams.push(semi_list[i-1].runner);
                }
            }

            this.setState({ finals: finals });
        } else if ( round_type === 'semi' ) {
            // basically get the winners of the semi and put them in the final
            let finals = this.state.finals;
            let semis = finals.semi.matches;
            finals.final.matches[0].teams.push(semis[0].result.win);
            finals.final.matches[0].teams.push(semis[1].result.win);
            finals.final.matches[0].determined = true;

            this.setState({ finals: finals });
        }
    }

    render() {
        console.log(this.state);

        // if good, start populating information
        if (this.state == null) {
            return (
                <Container className="NotFound">
                    <p>This tournament cannot be found</p>
                </Container>
            );
        }

        return (
            <Grid stackable columns={2} padded className="main">
                <Grid.Column className="tournament" as="section" width={11}>
                    <Header as='h1'>{ this.state.name }</Header>

                    <Preliminary pools={ this.state.pools }
                        tournament={ this.state }
                        matches={ this.state.pool_matches }
                        onResult={ this.handleResult }
                    />
                    <Finals tournament={ this.state }
                        matches={ this.state.finals }
                        onResult={ this.handleFinalResult } />
                </Grid.Column>
                <Grid.Column className="supplementary" as="aside" width={5}>
                    <Header as="h3">
                        <DateFormat date={ this.state.date } />
                        <Header.Subheader>
                            Tournament date
                        </Header.Subheader>
                    </Header>

                    <Header as="h3">
                        { this.state.official }
                        <Header.Subheader>
                            Organiser
                        </Header.Subheader>
                    </Header>

                    <Header as="h3">Teams</Header>
                    <TeamList
                        teams={ this.state.teams }
                        onTeamChange={ this.handleTeamChange }
                    />

                    <section className="stats">
                        <Header as="h3">Matches complete</Header>
                        <Statistic.Group>
                            {
                                this.state.pools.map((pool, index) => {
                                    const name = `Group ${String.fromCharCode(65+index)}`;
                                    const matches = this.state.pool_matches;
                                    const p_matches = _.filter(matches, {'pool': pool.id});
                                    const resulted = _.reduce(p_matches, (result, value) => {
                                        return result + (value.result.resulted ? 1 : 0);
                                    }, 0);
                                    return (
                                        <Statistic key={pool.id}>
                                            <Statistic.Value>
                                                { resulted } / { p_matches.length }
                                            </Statistic.Value>
                                            <Statistic.Label>{ name }</Statistic.Label>
                                        </Statistic>
                                    )
                                })
                            }
                        </Statistic.Group>

                    </section>

                </Grid.Column>
            </Grid>
        );
    }
}

export default Tournament;

