import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

import CreateTournament from '../../layouts/createTournament/';
import Tournament from '../../layouts/tournament/';
import Home from '../../layouts/home/';

class Base extends Component {
    // this is the base structure for the entire app and provides the top
    // level template and view routing

    state = {};

    render() {

        const {activeItem} = this.state;

        return (
            <main>
                <header className="app-header">
                    <Menu>
                        <Menu.Item name="Home" href="/" active={activeItem === 'home'} />

                        <Switch>
                            <Route exact path="/tournament/create"/>
                            <Route>
                                <Menu.Menu position="right">
                                    <Menu.Item>
                                        <Button primary href="/tournament/create">
                                            Create Tournament
                                        </Button>
                                    </Menu.Item>
                                </Menu.Menu>
                            </Route>
                        </Switch>
                    </Menu>

                </header>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/tournament/create" component={CreateTournament} />
                    <Route path="/tournament/:id" component={Tournament} />
                    <Route path="/tournament/:id/*" component={Tournament} />
                </Switch>
                <Container as="footer" textAlign="center">
                    <p>
                        Tournament manager, hand-crafted
                        by <a href="https://twitter.com/ajfisher">ajfisher</a> at
                        Rocket Melbourne. Source code available
                        at <a href="https://github.com/ajfisher/tourney-tools">GitHub</a>
                    </p>
                </Container>
            </main>
        );
    }

}

export default Base;
