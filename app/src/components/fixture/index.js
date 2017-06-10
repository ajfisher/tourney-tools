import _ from 'lodash';

import React, { Component } from 'react';
import { Button, Card } from 'semantic-ui-react'

class Fixture extends Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: props.teams,
            matches: props.matches,
        };
    };

    render () {
        const { teams, matches } = this.state;

        return (
            <Card.Group>
                {
                    matches.map((match) => {

                        let result = "";

                        let team_a = _.find(teams, {'id': match.teams[0]});
                        let team_b = _.find(teams, {'id': match.teams[1]});

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
                                        <Button basic >
                                            Record result
                                        </Button>
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

