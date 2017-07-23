import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { Modal, Table} from 'semantic-ui-react'

import TeamDetails, { TeamSwatch } from '../team';

class TeamList extends Component {

    constructor(props) {
        super(props);

        // use this to store the state of team view open states, which are
        // all set to false.
        let team_open = new Array(this.props.teams.length);
        for (let i=0; i< team_open.length; i++) {
            team_open[i] = false;
        }

        this.state = {
            modals_open: team_open,
        }
    }

    handle_open = (team_index) => () =>  {
        // as we need to control the set modals, we need to open them up
        let {modals_open} = this.state;
        modals_open[team_index] = true;
        this.setState({modals_open: modals_open});

        ReactGA.event({
            category: 'team',
            action: 'Viewed Team Details',
            label: 'team:' + this.props.teams[team_index].id,
        });

    };

    handle_close = (team_index) => () => {
        // as we need to control the set of modals, we need to close them
        let { modals_open } = this.state;
        modals_open[team_index] = false;
        this.setState({modals_open: modals_open});
    };

    save_team = (team_index) => (team) => {
        console.log("team list save");
        this.props.onTeamChange(team);

        // need to call it this way as handle close returns a function
        // so we're just immediately executing it.
        this.handle_close(team_index)();
    }

    render () {
        return (
            <Table unstackable singleLine striped compact>
                <Table.Body>
                {
                    this.props.teams.map((team, index) => {
                        return (
                            <Modal key={index} dimmer="blurring" basic
                                open={ this.state.modals_open[index] }
                                trigger={
                                    <Table.Row key={index}
                                        onClick={ this.handle_open(index) } >
                                        <Table.Cell>
                                            <TeamSwatch name={team.name} avatar={team.avatar} />
                                            {team.name}
                                        </Table.Cell>
                                    </Table.Row>
                                }
                            >
                                <Modal.Content>
                                    <TeamDetails team={team} authed={ this.props.authed }
                                        onSave={ this.save_team(index) }
                                        onClose={ this.handle_close(index) }
                                    />
                                </Modal.Content>
                            </Modal>
                        )
                    })
                }
                </Table.Body>
            </Table>
        );
    }
}

export default TeamList;
