import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import TournamentLink from '../tournament-link'

import tournaments from '../../data/tournaments.js';

import './styles.css';
import logo from './logo.svg';

const About = () => (<div><h2>About</h2></div>);

class Home extends Component {
    render() {
        return (
            <div><h2>Home</h2></div>
        );
    }
}

class App extends Component {
    render() {

        const tournamentlist = tournaments.tournaments;

        return (
                <div className="app">
                    <div className="app-header">
                        <p className="logo">
                            <Link to="/">Logo</Link>
                        </p>
                        <div className="nav">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About</Link></li>
                            </ul>
                        </div>
                        <h2>Welcome to Tourney Tools</h2>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/about" component={About} />
                        </Switch>
                    </div>
                    <p className="app-intro">
                        You can see here a list of tournaments
                    </p>
                    <ul className="tournaments">

                        <li key="123">Tournament name</li>
                        <li key="456">Tournament name</li>

                    </ul>
                </div>
        );
    }
}

export default App;
