import React, { Component } from 'react';
import { Container, Header, Icon, Image, Modal, Segment, Table} from 'semantic-ui-react'

import GeoPattern from 'geopattern';

class TeamList extends Component {

    launchTeamView = (team) => (e) => {
        console.log(team);
    };

    render () {
        return (
            <Table unstackable singleLine striped compact>
                <Table.Body>
                {
                    this.props.teams.map((team, index) => {
                        return (
                            <Modal
                                key={index}
                                dimmer="blurring"
                                trigger={
                                    <Table.Row key={index}>
                                        <Table.Cell>
                                            {team.name}
                                        </Table.Cell>
                                    </Table.Row>
                                }
                            >
                                <Modal.Content>
                                    <Container>
                                        <Segment.Group>
                                            <Segment size="massive">
                                                <Header as="h2" textAlign="center">{team.name}</Header>
                                            </Segment>
                                            <Segment>
                                                <Header as="h3">
                                                    <Icon name="users" size="small"/>
                                                    <Header.Content>
                                                        Members
                                                    </Header.Content>
                                                </Header>
                                                {
                                                    team.members.map((member, j) => {

                                                        let avatar = GeoPattern.generate(member);

                                                        return (
                                                            <p key={ j }>
                                                                <Image avatar src={avatar.toDataUri()} />
                                                                { member }
                                                            </p>
                                                        );
                                                    })
                                                }
                                                <Image size="medium"
                                                    src={ GeoPattern.generate(team.name,
                                                            { generator: 'plaid'}
                                                        ).toDataUri() }/>
                                            </Segment>
                                        </Segment.Group>
                                    </Container>
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
