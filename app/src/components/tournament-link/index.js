import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TournamentLink extends Component {

    render() {
        return (
            <li key="asbdhfjdhdsj">
                <Link to="/tournaments/abcdef">test</Link>
            </li>
        );
    }
}

export default TournamentLink;

