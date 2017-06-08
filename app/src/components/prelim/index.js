import _ from 'lodash';
import React, { Component } from 'react';
import {Container, Menu } from 'semantic-ui-react'

import Leaderboard from '../leaderboard';

class Preliminary extends Component {

    state = {
        active_panel: 'leaderboard',
        active_pool: null,
    }

    handleItemClick = (e, { name }) => this.setState({active_panel: name });

    handlePoolClick = (e, { id }) => {
        // load the various teams from the pool now.

        let teamlist = _.find(this.props.pools, {'id': id});
        this.setState({active_pool: id, teams: teamlist.teams });
    };

    constructor(props) {
        super(props);
        // update to the first on when we make the overall component
        //
        this.state = {
            active_pool: props.pools[0].id,
            active_panel: 'leaderboard',
            teams: props.pools[0].teams,
        };
    }

    render () {
        const { active_panel, active_pool, teams } = this.state;

        // set up the panels for selection
        const panels = {
            'leaderboard' : <Leaderboard teams={teams} />,
            'fixture': <p>ficture</p>,
        };

        return (
            <Container fluid as="section" className="prelims">
                <Menu pointing secondary>
                    {
                        this.props.pools.map((pool, index) => {
                            const name = `Pool ${String.fromCharCode(65+index)}`
                            return (
                                <Menu.Item key={pool.id} name={name} id={pool.id}
                                    active={active_pool === pool.id}
                                    onClick={this.handlePoolClick}
                                />
                            );
                        })
                    }
                </Menu>
                <Menu pointing>
                    <Menu.Item name='leaderboard'
                        active={active_panel === 'leaderboard'}
                        onClick={this.handleItemClick} />
                    <Menu.Item name='fixture'
                        active={active_panel === 'fixture'}
                        onClick={this.handleItemClick} />
                </Menu>

                { panels[active_panel] }

            </Container>
        );
    }

}

export default Preliminary;

