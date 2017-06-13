import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';

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

    state = {};

    render() {

        const {activeItem} = this.state;

        return (
            <main>
                <header className="app-header">
                    <Menu stackable>
                        <Menu.Item name="Home" href="/" active={activeItem === 'home'} />
                        <Menu.Item name="About" href="/about" />

                        <Menu.Menu position="right">
                            <Menu.Item>
                                <Button primary href="/tournament/create">
                                    Create Tournament
                                </Button>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>

                </header>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route exact path="/tournament/create" component={CreateTournament} />
                    <Route path="/tournament/:id" component={Tournament} />
                    <Route path="/tournament/:id/*" component={Tournament} />
                </Switch>
                <footer>
                    <p>Footer info</p>
                </footer>
            </main>
        );
    }

}

export default Base;
