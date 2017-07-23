import _ from 'lodash';
import React, { Component } from 'react';
import ReactGA from 'react-ga';

import {Container, Header, Menu } from 'semantic-ui-react'

import Fixture from '../fixture';
import Leaderboard from '../leaderboard';

const points = { win: 3, lose: 1, draw: 2 };

class Preliminary extends Component {

    constructor(props) {
        super(props);

        // if this is new then set to the first pool
        this.state = {
            active_pool: props.pools[0].id,
            active_panel: 'leaderboard',
        };
    };

    get_pool_data(pool_id) {
        // gets the data for the supplied pool

        let teamids = _.find(this.props.pools, {'id': pool_id}).teams;
        let teamlist = _.filter(this.props.tournament.teams, (team) => {
            return teamids.includes(team.id);
        });

        let matchlist = _.filter(this.props.matches, {'pool': pool_id});
        let standings = this.calculate_standings(teamlist, matchlist);

        return ( {
            teams: teamlist,
            matches: matchlist,
            standings: standings,
        });
    };

    calculate_standings(teamlist, matchlist) {
        // takes a list of teams and matches and then composes the current
        // team standings.

        let standings = []; // this will end up as an ordered team list
        standings = _.map(teamlist, (team) => {
            // for each team, get all of their results and reduce to value.
            // get just the matches where the team played
            let matches = _.filter(matchlist, (match) => {
                return ( match.teams.includes(team.id) && match.result.resulted);
            });

            let teamdata = {
                id: team.id,
                matches: matches.length,
                wins: _.reduce(matches, (result, value) => {
                    if (value.result.win === team.id) {
                        return result + 1;
                    } else {
                        return result;
                    }
                }, 0),
                losses: _.reduce(matches, (result, value) => {
                    if (value.result.lose === team.id) {
                        return result + 1;
                    } else {
                        return result;
                    }
                }, 0),
                draws: _.reduce(matches, (result, value) => {
                    if (value.result.draw) {
                        return result + 1;
                    } else {
                        return result;
                    }
                }, 0),
            };

            teamdata.points = (teamdata.wins * points.win) +
                (teamdata.losses * points.lose) +
                (teamdata.draws * points.draw);

            return teamdata;
        });

        // now sort the standings array and send it back
        standings = _.orderBy(standings, 'points', 'desc');

        return standings;
    };

    // Handle changes between menu items
    handlePanelClick = (e, { name }) => {

        ReactGA.event({
            category: 'prelim',
            action: 'Change View',
            label: name,
        });

        this.setState({active_panel: name });
    }

    //handle the changes between pools
    handlePoolClick = (e, { id }) => {
        ReactGA.event({
            category: 'pool',
            action: 'Change Pool',
            label: id,
        });

        this.setState({ active_pool: id });
    }

    // passes back to the tournament to update the result details
    handleResult = (match) => this.props.onResult(match, 'prelim');

    render () {

        const { active_panel, active_pool } = this.state;
        const { teams, matches, standings } = this.get_pool_data(active_pool);

        // set up the panels for selection
        let panel = null;
        if (active_panel === 'leaderboard') {
            panel =  <Leaderboard teams={teams} standings={standings} />;
        } else {
            panel = <Fixture teams={teams} authed={ this.props.authed }
                    matches={matches}
                    onResult={ this.handleResult } />;
        };

        return (
            <Container fluid as="section" className="prelims">
                <Header as="h2">Group stage</Header>
                <Menu pointing secondary>
                    {
                        this.props.pools.map((pool, index) => {
                            const name = `Group ${String.fromCharCode(65+index)}`
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
                        onClick={this.handlePanelClick} />
                    <Menu.Item name='fixture'
                        active={active_panel === 'fixture'}
                        onClick={this.handlePanelClick} />
                </Menu>

                { panel }

            </Container>
        );
    }
}

export default Preliminary;
