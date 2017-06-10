import React, { Component } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';

import Preliminary from '../../components/prelim';

import { tournaments } from '../../data/tournaments';
import  matches  from '../../data/matches';

class Tournament extends Component {
    // sets up the Tournament layout

    constructor(props) {
        super(props);
        const id = props.match.params.id;

        let tournament = tournaments.findById(id);
        tournament.pool_matches = matches;
        this.state = tournament;
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

                    <Preliminary pools={this.state.pools}
                        tournament={this.state}
                        matches={this.state.pool_matches} />
                    <p>Elimination info</p>
                </Grid.Column>
                <Grid.Column className="supplementary" as="aside" width={5}>
                    <Header as="h2">Date</Header>
                    <p>{ this.state.date }</p>

                    <Header as="h2">Organised by</Header>
                    <p>{ this.state.official }</p>

                    <p>
                        Tournament ID: { this.state.id },
                    </p>

                </Grid.Column>
            </Grid>
        );
    }
}

export default Tournament;

