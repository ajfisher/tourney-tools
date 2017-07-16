import _ from 'lodash';

import React, { Component } from 'react';
import { Container, Divider, Header } from 'semantic-ui-react';

import Fixture from '../fixture';

const final_rounds = {
    "1": ["final"],
    "2": [ "semi", "final", ],
    "4": [ "quarter", "semi", "final" ],
    "8": [ "round16", "quarter", "semi", "final" ]
}

const final_names = {
    "round16": "Round of 16",
    "quarter": "Quarter Finals",
    "semi": "Semi Finals",
    "final": "Final",
}

class Final extends Component {

    handleResult = (match) => this.props.onResult(match, this.props.finalType);

    render() {
        const { authed, finalType, teams, matches } = this.props;

        return (
            <Container>
                <Divider section />
                <Header as="h2">{ final_names[finalType]}</Header>
                <Fixture teams={ teams }
                    matches={ matches }
                    finalType={finalType}
                    onResult={ this.handleResult }
                    authed={ authed }
                />
            </Container>
        )
    }
}

class Finals extends Component {

    handleResult = (match, finalType) => this.props.onResult(match, finalType);


    render() {

        const no_pools = this.props.tournament.pools.length;
        const teams = this.props.tournament.teams;

        return (
            <Container>
            {
                _.map(final_rounds[no_pools], (final_type, i) => {
                    const matches = this.props.matches[final_type].matches;
                    return (
                        <Final key={ i } finalType={final_type}
                            teams={ teams }
                            matches={ matches }
                            onResult={ this.handleResult }
                            authed={ this.props.authed }
                        />
                    )
                })
            }
            </Container>
        )
    }
}

export default Finals
export { final_rounds }
