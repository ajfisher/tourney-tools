import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Container, Grid, Header, Icon, Image, Input, List, Segment } from 'semantic-ui-react'

import GeoPattern from 'geopattern';

const media_url = "http://localhost:3002/media";

export class TeamSwatch extends Component {

    render() {

        const { name, avatar } = this.props;

        let image = null;

        if (avatar) {
            image = media_url + avatar;
        } else {
            image = GeoPattern.generate(name).toDataUri();
        }

        return (
            <Image avatar bordered src={ image } />
        )
    }
}

class TeamName extends Component {
    // TODO make the team name editable

    change = (e, data) => {
        this.props.onDataChange(e, data);
    }

    widget() {
        // returns a heading or an input for the team name
        const editing = this.props.editMode;
        const teamname = this.props.teamName;

        if (editing) {
            return (
                <Input
                    placeholder="Team name..."
                    defaultValue={teamname}
                    onChange={ this.change }
                />
            )
        } else {
            return (
                <teamname>{teamname}</teamname>
            )
        }
    }

    render() {
        return this.widget()
    };
}

class TeamMember extends Component {

    name_change = (e, data) => {
        this.props.onDataChange(e, data);
    }

    name_widget() {
        // returns the appropriate widget for the name.
        //
        const editing = this.props.editMode;
        const name = this.props.name;

        if (editing) {
            return (
                <Input
                    placeholder="Name..."
                    defaultValue={name}
                    onChange={ this.name_change }
                />
            )
        } else {
            return (
                <name>{name}</name>
            )
        }
    }

    render() {

        return (
            <List.Item>
                <TeamSwatch name={ this.props.name }/>
                <List.Content>
                    <List.Header as="span">
                        { this.name_widget() }
                    </List.Header>
                </List.Content>
            </List.Item>
        )
    }
}

class TeamDetails extends Component {

    constructor(props) {
        super(props);

        // take a deep copy so we can change it independently properly.
        this.state = {
            team: _.cloneDeep(props.team),
            edit_mode: false,
        };
    }

    member_change = (member_key) => (e, data) => {
        // fired when a member's details gets changed.
        // update the state of the team ready for save.
        let teamdata = this.state.team;
        teamdata.members[member_key] = data.value;
        this.setState({ team: teamdata });
    }

    team_name_change = (e, data) => {
        // fired when the team name gets changed
        let teamdata = this.state.team;
        teamdata.name = data.value;
        this.setState({team: teamdata });
    }

    // this is passes off the team data back to a higher place to save it off.
    save_changes = () => {
        this.props.onSave(this.state.team);
    }

    cancel_changes = () => {
        this.setState({team: this.props.team });
        this.props.onClose();
    }

    switch_modes = (e) => {
        this.setState({ edit_mode: !this.state.edit_mode });
    }

    mode_buttons(edit_mode) {

        if (edit_mode) {
            return (
                <Segment>
                    <Container textAlign="center">
                        <Button
                            onClick={ this.save_changes }
                            content="Save changes" positive/>
                        <Button
                            onClick={ this.cancel_changes }
                            content="Cancel" basic />
                    </Container>
                </Segment>
            )
        } else {
            return (
                <Segment>
                    <Container textAlign="center">
                        <Button content="Edit team" onClick={ this.switch_modes }/>
                        <Button
                            onClick={ this.cancel_changes }
                            content="Cancel" basic />
                    </Container>
                </Segment>
            )
        }
    }

    render() {

        const { team, edit_mode } = this.state;

        let teamimage = null;

        if (team.avatar) {
            teamimage = media_url + team.avatar;
        } else {
            teamimage = GeoPattern.generate(team.name).toDataUri();
        }

        return (
            <Container>
                <Segment.Group>
                    <Segment size="massive">
                        <Header as="h2" textAlign="center">
                            <TeamName
                                teamName={team.name}
                                editMode={edit_mode}
                                onDataChange={ this.team_name_change }
                            />
                        </Header>

                    </Segment>
                    <Segment>
                        <Grid columns="2" centered>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header as="h3">
                                        <Icon name="users" size="small"/>
                                        <Header.Content>
                                            Members
                                        </Header.Content>
                                    </Header>
                                    <List relaxed>
                                    {
                                        team.members.map((member, j) => {
                                            return (
                                                <TeamMember
                                                    key={j} name={member}
                                                    editMode={edit_mode}
                                                    onDataChange={this.member_change(j)}
                                                />
                                            );
                                        })
                                    }
                                    </List>
                                </Grid.Column>
                                <Grid.Column>
                                    <Image size="medium" floated="right"
                                        src={ teamimage }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    { this.mode_buttons(edit_mode) }
                </Segment.Group>
            </Container>
        )
    }
}

export default TeamDetails;
