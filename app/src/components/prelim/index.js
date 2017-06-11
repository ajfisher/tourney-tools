import _ from 'lodash';
import React, { Component } from 'react';
import {Container, Menu } from 'semantic-ui-react'

import Fixture from '../fixture';
import Leaderboard from '../leaderboard';

const points = { win: 3, lose: 1, draw: 2 };

class Preliminary extends Component {

    constructor(props) {
        super(props);
        // update to the first on when we make the overall component
        //
        let pooldata = this.get_pool_data(props.pools[0].id);

        this.state = {
            active_pool: props.pools[0].id,
            active_panel: 'leaderboard',
            teams: pooldata.teams,
            matches: pooldata.matches,
            standings: pooldata.standings,
        };
    };

    get_pool_data(id) {
        // gets the data for a respective pool
        //
        let teamids = _.find(this.props.pools, {'id': id}).teams;
        let teamlist = _.filter(this.props.tournament.teams, (team) => {
            return teamids.includes(team.id);
        });

        let matchlist = _.filter(this.props.matches, {'pool': id});

        let standings = this.calculate_standings(teamlist, matchlist);

        return ( {
            teams: teamlist,
            matches: matchlist,
            standings: standings,
        });
    };

    calculate_standings(teamlist, matchlist) {
        // takes a list of teams the matches and then composes the current
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
                    if (value.result.loss === team.id) {
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

        // now sort the table.
        standings = _.orderBy(standings, 'points', 'desc');

        return standings;
    };

    handleItemClick = (e, { name }) => this.setState({active_panel: name });

    handlePoolClick = (e, { id }) => {
        // load the various teams from the pool now.

        let pooldata = this.get_pool_data(id);

        this.setState({
            active_pool: id,
            teams: pooldata.teams,
            matches: pooldata.matches,
            standings: pooldata.standings,
        });

    };

    handleResult = (match) => {

        let matches = this.state.matches;
        let index = _.find(matches, {'id': match.id});
        matches[index] = match;

        this.setState({
            matches: matches,
            standings: this.calculate_standings(this.state.teams, matches),
        });

    };

    render () {
        const { active_panel, active_pool, teams, matches, standings } = this.state;

        // set up the panels for selection
        let panel = null;
        if (active_panel === 'leaderboard') {
            panel =  <Leaderboard teams={teams} standings={standings} />;
        } else {
            panel = <Fixture teams={teams}
                            matches={matches}
                            onHandleResult={ this.handleResult } />;
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

                { panel }

            </Container>
        );
    }

}

export default Preliminary;

