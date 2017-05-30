import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import { tournaments } from '../../data/tournaments';

import CreateTournament from '../../layouts/createTournament/';
import Tournament from '../../layouts/tournament/';

const About = () => (<div><h2>About</h2></div>);

class Home extends Component {
    render() {
        return (
            <div>
                <h2>Welcome to Tourney Tools</h2>
            </div>
        );
    }
}

class Base extends Component {
    // this is the base structure for the entire app and provides the top
    // level template and view routing

    render() {
        const tournamentlist = tournaments.tournaments;
        return (
            <main className="main">
                <header className="app-header">
                    <p className="logo">
                        <Link to="/">Logo</Link>
                    </p>
                    <nav className="nav">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/tournament/create">Create Tournament</Link></li>
                        </ul>
                    </nav>
                </header>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/tournament/create" component={CreateTournament} />
                    <Route path="/tournament/:id" component={Tournament} />
                </Switch>
                <footer>
                    <p>Footer info</p>
                </footer>
                <ul className="tournaments">

                    <li key="123">Tournament name</li>
                    <li key="456">Tournament name</li>

                </ul>
            </main>
        );
    }

}

export default Base;
