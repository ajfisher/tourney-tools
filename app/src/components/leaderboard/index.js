import _ from 'lodash';

import React, { Component } from 'react';
import { Table } from 'semantic-ui-react'

import { TeamSwatch } from '../team';

class Leaderboard extends Component {

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
                                <Table.Row key={index}>
                                    <Table.Cell>{ index + 1 }</Table.Cell>
                                    <Table.Cell>
                                        <TeamSwatch name={team.name} avatar={ team.avatar } />
                                        { team.name }
                                    </Table.Cell>
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

