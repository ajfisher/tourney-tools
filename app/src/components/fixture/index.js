import _ from 'lodash';

import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'

import Result from '../result';

class Fixture extends Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: props.teams,
            matches: props.matches,
        };
    };

    // we do this to create a closure and return a function to the
    // handler in the object, which will allow a call later.
    //handle_result_click = (match) => (e) => {
    //    const result_modal = <Result match={ this.state.matches } />;

    //    result_modal.render('show');
    //    console.log(result_modal);
    //};

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

        this.props.onHandleResult(match);
    }

    handle_draw_result = (match_id) => {

        // get  the match
        let matches = this.state.matches;
        let index = _.findIndex(matches, {'id': match_id});
        let match = matches[index];
        match.result.resulted = true;
        match.result.draw = true;

        matches[index] = match;

        this.setState({matches: matches});
        this.props.onHandleResult(match);
    }

    render () {
        const { teams, matches } = this.state;

        return (
            <Card.Group>
                {
                    matches.map((match) => {

                        let result = "";

                        const team_a = _.find(teams, {'id': match.teams[0]});
                        const team_b = _.find(teams, {'id': match.teams[1]});

                        //console.log(match);
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

                        return (
                            <Card key={ match.id } className="fixture">
                                <Card.Content>
                                    <Card.Header>
                                        { team_a.name } v { team_b.name }
                                    </Card.Header>
                                    <Card.Meta>
                                        { result }
                                    </Card.Meta>
                                    <Card.Description>
                                        <Result
                                            match={ match }
                                            teamA={ team_a } teamB={team_b}
                                            onWinResult={ this.handle_win_result }
                                            onDrawResult={ this.handle_draw_result }
                                        />
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

