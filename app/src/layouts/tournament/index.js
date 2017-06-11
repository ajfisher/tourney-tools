import _ from 'lodash';

import React, { Component } from 'react';
import { Container, Grid, Header, Statistic } from 'semantic-ui-react';

import Preliminary from '../../components/prelim';

import { load_state, save_state } from '../../lib/localstorage.js'

// get data
import { tournaments } from '../../data/tournaments';
import  matches  from '../../data/matches';

class Tournament extends Component {
    // sets up the Tournament layout

    constructor(props) {
        super(props);
        const id = props.match.params.id;

        const loaded_data = load_state(id);
        console.log(loaded_data);
        // try to get data from localstorage first
        if (loaded_data) {
            console.log("Loading from state");
            this.state = loaded_data;
        } else {
            console.log("Loading from data file");
            let tournament = tournaments.findById(id);
            tournament.pool_matches = matches;
            this.state = tournament;
        }
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
                    <p>Elimination info</p>
                </Grid.Column>
                <Grid.Column className="supplementary" as="aside" width={5}>
                    <Header as="h2">Date</Header>
                    <p>{ this.state.date }</p>

                    <Header as="h2">Organised by</Header>
                    <p>{ this.state.official }</p>

                    <p>
                        Tournament ID: { this.state.id }
                    </p>
                    <section className="stats">
                        <Header as="h2">Matches complete</Header>
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

