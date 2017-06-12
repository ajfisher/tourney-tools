import _ from 'lodash';

import React, { Component } from 'react';
import { Table } from 'semantic-ui-react'

class Leaderboard extends Component {

    handleTeamClick = (teamdata) => (e) => {
        console.log("team click");
        console.log(teamdata);

        // TODO add a point here that can trigger the open state of the modal
    };

    render () {

        const { teams, standings } = this.props;

        return (
            <Table singleLine celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell collapsing></Table.HeaderCell>
                        <Table.HeaderCell collapsing>Team</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">M</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">W</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">L</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">D</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Pts</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        standings.map((teamdata, index) => {

                            let team = _.find(teams, {'id': teamdata.id});

                            return (
                                <Table.Row key={index} onClick={ this.handleTeamClick(team) }>
                                    <Table.Cell>{ index + 1 }</Table.Cell>
                                    <Table.Cell>{ team.name }</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        { teamdata.matches }
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        { teamdata.wins }
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        { teamdata.losses }
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        { teamdata.draws }
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        { teamdata.points }
                                    </Table.Cell>
                                    {
                                    // add a teamview component which is a modal
                                    // and has a prop to determine it being open or not
                                    // Actually don't do this - we'll move to a list
                                    // that is on the actual RHS of the screen.
                                    // in an accordion
                                    }
                                </Table.Row>
                            );
                        })
                    }
                </Table.Body>
            </Table>
        )
    }
}

export default Leaderboard;

