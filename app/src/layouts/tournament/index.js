import _ from 'lodash';

import { parse } from 'qs';
import React, { Component } from 'react';
import { Container, Dimmer, Grid, Header, Loader, Statistic } from 'semantic-ui-react';

// get custom components
import DateFormat from '../../components/date';
import Finals from '../../components/finals';
import { final_rounds } from '../../components/finals';
import Preliminary from '../../components/prelim';
import TeamList from '../../components/teamlist';


class Tournament extends Component {
    // sets up the Tournament layout

    constructor(props) {
        super(props);
        const id = props.match.params.id;

        const qs = parse(props.location.search.substr(1));

        let secret = qs.sk || null;

        this.load_data(id, secret);

        // TODO update process to start a web socket and send data that way
    };

    load_data = (id, secret) => {
        // gets the actual tournament data.

        let tournament = null;

        this.state = { loading: true, sk: secret };

        const options = {
            method: 'GET',
            headers: new Headers({
                'X-Tournament-Secret': secret || '',
            }),
        }

        const url = "/api/tournament/" + id;

        let request = new Request(url, options);
        // get the tournament data from the server
        fetch(request).then((res) => {
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
                tournament.finals = {};

                tournament.finals_required.forEach((finaltype) => {
                    tournament.finals[finaltype] = {};
                    tournament.finals[finaltype]["matches"] = _.filter(matches, {type: finaltype});
                });

                this.setState(tournament);
                this.setState({loading: false});

            }).catch((err) => {
                console.log(err);
                this.setState({loading: false, status: 404 });
            });

        }).catch((err) => {
            console.log(err);
            this.setState({loading: false, status: 404 });
        });

    };

    handleResult = (match, match_type) => {
        // this occurs when a result gets posted so we want to update the
        // results of the matches.

        let request = new Request("/api/match/" + match.id,
            {
                method: 'PUT',
                headers: new Headers({
                    'X-Tournament-Secret': this.state.sk,
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

            let matches = [];
            if (match_type === 'prelim') {
                matches = this.state.pool_matches;
                let index = _.findIndex(matches, {'id': match.id});
                matches[index] = m;

                this.setState({pool_matches: matches});
            } else {
                let finals = this.state.finals;
                matches = finals[match_type].matches;
                let index = _.findIndex(matches, {'id': match.id});
                matches[index] = m;
                // update the finals again.
                finals[match_type].matches = matches;

                this.setState({finals: finals});
            }

            this.checkRoundComplete(matches, match_type);

        }).catch((err) => {
            console.log("Couldn't update match", err);
        });
    };

    handleTeamChange = (team) => {
        // update the state with the change of the team data
        let request = new Request("/api/team/" + team.id,
            {
                method: 'PUT',
                headers: new Headers({
                    'X-Tournament-Secret': this.state.sk,
                }),
                body: JSON.stringify(team),
            });

        fetch(request).then((res) => {
            //console.log(res);
            if (! res.ok) {
                throw new Error(res.json());
            } else {
                return res.json();
            }
        }).then((t) => {
            let teams = this.state.teams;
            let teamindex = _.findIndex(teams, {id: t.id});
            teams[teamindex] = t;

            this.setState({teams: teams});

        }).catch((err) => {
            console.log("Couldn't update team", err);
        });
    }

    checkRoundComplete(matches, round_type) {
        // now we need to check if all the matches have resulted.
        let result_count = _.reduce(matches, (result, value) => {
            return result + (value.result.resulted ? 1 : 0);
        }, 0);

        if (result_count === matches.length) {

            this.advanceRound(round_type);
        }

    }

    advanceRound(round_type) {
        // we need to advance the round. To do that we need
        // to know the original round (round type) the next round
        // and the team list and the matches to derive the next lot
        // probably just shortcut this for the moment.

        let { rounds_finished } = this.state;
        rounds_finished[round_type] = true;

        const clean_result = { resulted: false, win: null, lose: null, draw: null };

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
                finals[elim_round].matches[i].result = clean_result;

                // make the teams object blank so is always fresh
                finals[elim_round].matches[i].teams = [];

                // now assign the teams
                finals[elim_round].matches[i].teams.push(elim_list[i].winner);

                if (pools.length === 1) {
                    // special case of a single pool prelim going to final
                    finals[elim_round].matches[i].teams.push(elim_list[i].runner);
                } else {
                    // do this so we swap the groups around winner vs runner up
                    if (i % 2 === 0) {
                        finals[elim_round].matches[i].teams.push(elim_list[i+1].runner);
                    } else {
                        finals[elim_round].matches[i].teams.push(elim_list[i-1].runner);
                    }
                }
            }

            // now we need to push all of this data up to the server to populate
            // the appropriate tournament and match data.
            this.publish_next_round(elim_round, finals[elim_round]);
            this.setState({ finals: finals });

        } else if ( round_type === 'semi' ) {

            // basically get the winners of the 2 semis and put them in the final
            let finals = this.state.finals;
            let semis = finals.semi.matches;

            finals.final.matches[0].teams = [];
            finals.final.matches[0].result = clean_result;

            finals.final.matches[0].teams.push(semis[0].result.win);
            finals.final.matches[0].teams.push(semis[1].result.win);
            finals.final.matches[0].determined = true;

            this.publish_next_round("final", finals.final);
            this.setState({ finals: finals });
        } else if (round_type === 'quarter' ) {
            let finals = this.state.finals;
            let quarters = finals.quarter.matches;

            for (let i = 0; i < 2; i++) {
                let semi = finals.semi.matches[i];
                semi.teams = [];
                semi.result = clean_result;
                semi.teams.push(quarters[i*2].result.win);
                semi.teams.push(quarters[i*2 + 1].result.win);
                semi.determined = true;
                finals.semi.matches[i] = semi;
            }

            this.publish_next_round("semi", finals.semi);
            this.setState({finals: finals});
        }
        // TODO add other rounds numbers in here
    };

    publish_next_round(round, new_round_details) {
        // this method generically deals with the sending of round completion
        // information to the server to process and store.

        const { id } = this.state;
        const url = "/api/tournament/" + id + "/rounds/" + round;

        const options = {
            method: 'PUT',
            headers: new Headers({
                'X-Tournament-Secret': this.state.sk,
            }),
            body: JSON.stringify(new_round_details),
        }

        let request = new Request(url, options);

        fetch(request).then((res) => {
            if (! res.ok) {
                throw new Error(res.json());
            } else {
                return res.json();
            }
        }).then((msg) => {
            // write now we don't do anything with this info.
            //console.log(msg);
        }).catch((err) => {
            console.log("Couldn't update tournament round", err);
        });
    };


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

        const { authed } = this.state;

        return (
            <Grid stackable columns={2} padded className="main">
                <Grid.Column className="tournament" as="section" width={11}>
                    <Header as='h1'>{ this.state.name }</Header>

                    <Preliminary pools={ this.state.pools }
                        tournament={ this.state }
                        matches={ this.state.pool_matches }
                        onResult={ this.handleResult }
                        authed={ authed }
                    />
                    <Finals tournament={ this.state }
                        matches={ this.state.finals }
                        onResult={ this.handleResult }
                        authed= { authed }
                    />
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
                        authed={ authed }
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
