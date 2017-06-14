import _ from 'lodash';

import React, { Component } from 'react';
import { Card, Container } from 'semantic-ui-react'

import Result from '../result';
import { TeamSwatch } from '../team';

class Fixture extends Component {

    constructor(props) {
        super(props);

        this.state = {
            matches: props.matches,
        };

    };

    // we do this to create a closure and return a function to the
    // handler in the object, which will allow a call later.
    handle_win_result = (result) => {

        // TODO - make call to the API to update the data

        let matches = this.state.matches;
        let index = _.findIndex(matches, {'id': result.match_id});
        let match = matches[index];
        match.result.resulted = true;
        match.result.win = result.winner_id;
        match.result.lose = result.loser_id;

        matches[index] = match;

        this.setState({matches: matches});

        this.props.onResult(match);
    }

    handle_draw_result = (match_id) => {

        // get  the match
        let matches = this.state.matches;
        let index = _.findIndex(matches, {'id': match_id});
        let match = matches[index];
        match.result.resulted = true;
        match.result.draw = true;

        matches[index] = match;

        //this.setState({matches: matches});
        this.props.onHandleResult(match);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.teams !== this.props.teams) {
            this.setState({
                matches: nextProps.matches,
            });
        }
    };


    render () {
        const { matches } = this.state;
        const { teams, finalType } = this.props;

        let fixtures_per_row = 2;
        if (finalType === 'final') {
            fixtures_per_row = 1;
        }

        return (
            <Card.Group stackable itemsPerRow={ fixtures_per_row }>
                {
                    matches.map((match) => {

                        let result = "";

                        let team_a, team_b;

                        let match_determined = match.determined || match.teams[0];

                        if (match_determined) {

                            team_a = _.find(teams, {'id': match.teams[0]});
                            team_b = _.find(teams, {'id': match.teams[1]});
                        } else {
                            team_a = { name: match.placeholder[0] };
                            team_b = { name: match.placeholder[1] };
                        }

                        if (match.result.resulted) {
                            if (match.result.draw) {
                                result = "Draw";
                            } else {
                                let winners = null;

                                if (match.result.win === team_a.id) {
                                    winners = team_a;
                                } else {
                                    winners = team_b
                                }

                                result = `${winners.name} won`;
                            }

                        } else {
                            result = "Awaiting result";
                        }

                        const card_colour = match.result.resulted ? 'green' : 'red';

                        let record_result = null;
                        if (match_determined) {
                            record_result = <Result
                                        match={ match }
                                        teamA={ team_a } teamB={team_b}
                                        onWinResult={ this.handle_win_result }
                                        onDrawResult={ this.handle_draw_result }
                                     />
                        }

                        return (
                            <Card key={ match.id } className="fixture"
                                color={card_colour}>
                                <Card.Content>
                                    <Card.Header>
                                        <Container textAlign="center">
                                            <TeamSwatch name={ team_a.name } /> 
                                            { team_a.name } vs { team_b.name }
                                            <TeamSwatch name={ team_b.name } />
                                        </Container>
                                    </Card.Header>
                                    <Card.Meta>
                                        <Container textAlign="center">
                                            Result: { result }
                                        </Container>
                                    </Card.Meta>
                                    <Card.Description>
                                        { record_result }
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        );
                    })
                }
            </Card.Group>
        );
    };
}

export default Fixture;

