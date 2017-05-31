import React, { Component } from 'react';

import TeamList from '../../components/teamlist';

import { tournaments } from '../../data/tournaments';

class Tournament extends Component {
    // sets up the Tournament layout

    //const tournamentlist = tournaments.tournaments;
    constructor(props) {
        super(props);
        const id = props.match.params.id;
        this.state = tournaments.findById(id);
    }

    render() {
        console.log(this.state);

        // if good, start populating information
        if (this.state == null) {
            return (
                <section className="NotFound">
                    <p>This tournament cannot be found</p>
                </section>
            );
        }

        return (
            <section className="tournament">
                <h2>{ this.state.name }</h2>
                <p>Tournament ID: { this.state.id }, Official: { this.state.official } , Date: { this.state.date }</p>
                <TeamList teams={this.state.teams} />
                <p>Pool list</p>
                <p>Elimination info</p>
                <p>Leaderboard</p>
            </section>
        );
    }
}

export default Tournament;

