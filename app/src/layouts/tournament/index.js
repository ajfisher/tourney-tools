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
                            placeholder: ["Pool A Winner", "Pool B Runner Up"],
                        },
                        {
                            id: "semi-2",
                            determined: false,
                            result: {
                                resulted: false,
                            },
                            teams: [],
                            placeholder: ["Pool B Winner", "Pool A Runner Up"],
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

        this.state = tournament;
    };

    handleResult = (match) => {
        // this occurs when a result gets posted so we want to update the
        // results of the matches.

        let matches = this.state.pool_matches;
        let index = _.findIndex(matches, {'id': match.id});
        matches[index] = match;

        this.setState({pool_matches: matches});

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

    handleRoundComplete = (teamdata) => {
        // team is a full list of all the teams along with their standings
        // ranking.
        // {
        //  round: 'prelim|round16|quarter|semi|final',
        //  matches: [
        //      match: {
        //  ]
        //  results: [
        //      team: {
        //          id: cksdk
        //          poolid: djsdsadj
        //          points: 12
        //  ]
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
                                    const name = `Pool ${String.fromCharCode(65+index)}`;
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

