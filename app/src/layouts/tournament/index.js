import _ from 'lodash';

import React, { Component } from 'react';
import { Container, Dimmer, Grid, Header, Loader, Statistic } from 'semantic-ui-react';

// get custom components
import DateFormat from '../../components/date';
import Finals from '../../components/finals';
import { final_rounds } from '../../components/finals';
import Preliminary from '../../components/prelim';
import TeamList from '../../components/teamlist';

// get custom libs
import { save_state } from '../../lib/localstorage.js'

class Tournament extends Component {
    // sets up the Tournament layout

    constructor(props) {
        super(props);
        const id = props.match.params.id;

        this.load_data(id);

        // TODO update process to start a web socket and send data that way
    };

    load_data = (id) => {
        // gets the actual tournament data.

        let tournament = null;

        this.state = { loading: true };

        // get the tournament data from the server
        fetch("/api/tournament/" + id).then((res) => {
            //console.log(res);
            if (! res.ok) {
                throw new Error(res.json());
            } else {
                return res.json();
            }
        }).then((data) => {

            tournament = data;

            // now we know we have a tournament, get the pool matches
            fetch("/api/tournament/" + id + "/matches").then((res) => {
                if (! res.ok) {
                    throw new Error(res.json());
                } else {
                    return res.json();
                }
            }).then((matches) => {

                // attach the matches to the right place in tournament object
                tournament.pool_matches = _.filter(matches, {type: 'group'});
                _.forEach(tournament.finals, (obj, finaltype) => {
                    tournament.finals[finaltype]["matches"] = _.filter(matches, {type: finaltype});
                });

                this.setState(tournament);
                this.setState({loading: false});

            }).catch((err) => {
                this.setState({loading: false, status: 404 });
            });

        }).catch((err) => {
            this.setState({loading: false, status: 404 });
        });

    };

    handleResult = (match) => {
        // this occurs when a result gets posted so we want to update the
        // results of the matches.

        let request = new Request("/api/match/" + match.id,
            {
                method: 'PUT',
                headers: new Headers({
                    'X-Tournament-Secret': 'ABC123',
                }),
                body: JSON.stringify(match),
            });

        fetch(request).then((res) => {
            //console.log(res);
            if (! res.ok) {
                throw new Error(res.json());
            } else {
                return res.json();
            }
        }).then((m) => {

            let matches = this.state.pool_matches;
            let index = _.findIndex(matches, {'id': match.id});
            matches[index] = m;

            this.setState({pool_matches: matches});

            this.checkRoundComplete(matches, 'prelim');

        }).catch((err) => {
            console.log("Couldn't update match", err);
        });
    };

    handleFinalResult = (match, finalType) => {
        // refactor this out as it's a duplicate of above
        //
        let finals = this.state.finals;
        let matches = finals[finalType].matches;
        let index = _.findIndex(matches, {'id': match.id});
        matches[index] = match;
        // update the finals again.
        finals[finalType].matches = matches;

        this.setState({finals: finals});

        this.checkRoundComplete(matches, finalType);

        // save the data to localstorage for later usage.
        //save_state(this.state.id, this.state);
    };

    handleTeamChange = (team) => {
        // update the state with the change of the team data
        let teams = this.state.teams;
        let teamindex = _.findIndex(teams, {id: team.id});
        teams[teamindex] = team;

        this.setState({teams: teams});

        //save_state(this.state.id, this.state);
        //TODO CALL API to update here.
    }

    checkRoundComplete(matches, round_type) {
        // now we need to check if all the matches have resulted.
        let result_count = _.reduce(matches, (result, value) => {
            return result + (value.result.resulted ? 1 : 0);
        }, 0);

        if (result_count === matches.length) {

            this.advanceRound(round_type);
        }

        save_state(this.state_id, this.state);
    }

    advanceRound(round_type) {
        // we need to advance the round. To do that we need
        // to know the original round (round type) the next round
        // and the team list and the matches to derive the next lot
        // probably just shortcut this for the moment.

        let { rounds_finished } = this.state;
        rounds_finished[round_type] = true;

        // TODO this needs to update to server
        this.setState({ rounds_finished: rounds_finished});

        if (round_type === "prelim") {
            const pools = this.state.pools;
            const matches = this.state.pool_matches;

            let elim_list = [];

            // work out based on the pool size, what our first elim round would be.
            let elim_round = final_rounds[pools.length][0];

            _.forEach(pools, (pool) => {

                let team_results = _.map(pool.teams, (teamid, index) => {

                    let team_matches = _.filter(matches, (match) => {
                        return ( match.teams.includes(teamid) && match.result.resulted);
                    });

                    let teamdata = {
                        id: teamid,
                        wins: _.reduce(team_matches, (result, value) => {
                            if (value.result.win === teamid) {
                                return result + 1;
                            } else {
                                return result;
                            }
                        }, 0),
                        losses: _.reduce(team_matches, (result, value) => {
                            if (value.result.lose === teamid) {
                                return result + 1;
                            } else {
                                return result;
                            }
                        }, 0),
                        draws: _.reduce(team_matches, (result, value) => {
                            if (value.result.draw) {
                                return result + 1;
                            } else {
                                return result;
                            }
                        }, 0),
                    };

                    teamdata.points = (teamdata.wins * 3) +
                        (teamdata.losses * 1) +
                        (teamdata.draws * 2);

                    return teamdata;

                });

                // now we have team_results for the pool.
                team_results = _.orderBy(team_results, 'points', 'desc');

                elim_list.push( {
                    winner: team_results[0].id,
                    runner: team_results[1].id,
                });
            });

            // now update the matches for the elimination round we're going into
            let finals = this.state.finals;

            for (let i=0; i < finals[elim_round].matches.length; i++) {

                finals[elim_round].matches[i].determined = true;

                // create a teams object if it doesn't exist
                if (typeof(finals[elim_round].matches[i].teams) === 'undefined') {
                    finals[elim_round].matches[i].teams = [];
                }

                // now assign the teams
                finals[elim_round].matches[i].teams.push(elim_list[i].winner);

                // do this so we swap the groups around winner vs runner up
                if (i % 2 === 0) {
                    finals[elim_round].matches[i].teams.push(elim_list[i+1].runner);
                } else {
                    finals[elim_round].matches[i].teams.push(elim_list[i-1].runner);
                }
            }

            // now we need to push all of this data up to the server to populate
            // the appropriate tournament and match data.
            // TODO push to server
            this.setState({ finals: finals });

        } else if ( round_type === 'semi' ) {

            // basically get the winners of the semi and put them in the final
            let finals = this.state.finals;
            let semis = finals.semi.matches;
            finals.final.matches[0].teams.push(semis[0].result.win);
            finals.final.matches[0].teams.push(semis[1].result.win);
            finals.final.matches[0].determined = true;

            // TODO push all the details to the server for the determined matches
            // and tournament
            this.setState({ finals: finals });
        }
    }

    render() {
        console.log(this.state);

        // if good, start populating information
        if (this.state == null || this.state.status === 404) {
            return (
                <Container className="NotFound">
                    <p>This tournament cannot be found</p>
                </Container>
            );
        }

        if (this.state.loading) {
            return (
                <Dimmer active>
                    <Loader size="massive">Loading tournament data</Loader>
                </Dimmer>
            );
        }

        return (
            <Grid stackable columns={2} padded className="main">
                <Grid.Column className="tournament" as="section" width={11}>
                    <Header as='h1'>{ this.state.name }</Header>

                    <Preliminary pools={ this.state.pools }
                        tournament={ this.state }
                        matches={ this.state.pool_matches }
                        onResult={ this.handleResult }
                    />
                    <Finals tournament={ this.state }
                        matches={ this.state.finals }
                        onResult={ this.handleFinalResult } />
                </Grid.Column>
                <Grid.Column className="supplementary" as="aside" width={5}>
                    <Header as="h3">
                        <DateFormat date={ this.state.date } />
                        <Header.Subheader>
                            Tournament date
                        </Header.Subheader>
                    </Header>

                    <Header as="h3">
                        { this.state.official }
                        <Header.Subheader>
                            Organiser
                        </Header.Subheader>
                    </Header>

                    <Header as="h3">Teams</Header>
                    <TeamList
                        teams={ this.state.teams }
                        onTeamChange={ this.handleTeamChange }
                    />

                    <section className="stats">
                        <Header as="h3">Matches complete</Header>
                        <Statistic.Group>
                            {
                                this.state.pools.map((pool, index) => {
                                    const name = `Group ${String.fromCharCode(65+index)}`;
                                    const matches = this.state.pool_matches;
                                    const p_matches = _.filter(matches, {'pool': pool.id});
                                    const resulted = _.reduce(p_matches, (result, value) => {
                                        return result + (value.result.resulted ? 1 : 0);
                                    }, 0);
                                    return (
                                        <Statistic key={pool.id}>
                                            <Statistic.Value>
                                                { resulted } / { p_matches.length }
                                            </Statistic.Value>
                                            <Statistic.Label>{ name }</Statistic.Label>
                                        </Statistic>
                                    )
                                })
                            }
                        </Statistic.Group>
                    </section>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Tournament;
