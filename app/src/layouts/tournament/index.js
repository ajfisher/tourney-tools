import React, { Component } from 'react';

class Tournament extends Component {
    // sets up the Tournament layout

    render() {
        return (
            <section className="tournament">
                <h2>Tournament name</h2>
                <p>Tournament ID, Official, Date</p>
                <p>Pool list</p>
                <p>Leaderboard</p>
                <p>Elimination info</p>
            </section>
        );
    }
}

export default Tournament;

