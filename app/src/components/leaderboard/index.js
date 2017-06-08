import React, { Component } from 'react';
import { Table } from 'semantic-ui-react'

class Leaderboard extends Component {

    render () {

        const { teams } = this.props;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell collapsing></Table.HeaderCell>
                        <Table.HeaderCell collapsing>Team</Table.HeaderCell>
                        <Table.HeaderCell>M</Table.HeaderCell>
                        <Table.HeaderCell>W</Table.HeaderCell>
                        <Table.HeaderCell>L</Table.HeaderCell>
                        <Table.HeaderCell>D</Table.HeaderCell>
                        <Table.HeaderCell>Pts</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        teams.map((id, index) => {

                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{ index }</Table.Cell>
                                    <Table.Cell>{ id }</Table.Cell>
                                    <Table.Cell>3</Table.Cell>
                                    <Table.Cell>1</Table.Cell>
                                    <Table.Cell>2</Table.Cell>
                                    <Table.Cell>0</Table.Cell>
                                    <Table.Cell>3</Table.Cell>
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

