import React, { Component } from 'react';
import {Card, Icon} from 'semantic-ui-react'

class TeamList extends Component {


    render () {
        console.log(this.props);
        return (
            <div className="teamlist">
                {
                    this.props.teams.map((team, index) => {
                        return (
                            <Card key={index}>
                                <Card.Content>
                                    <Icon name="users" />
                                    {team.name}
                                </Card.Content>
                            </Card>
                        );
                    })
                }
                <p>This is a team list</p>
            </div>
        );
    }
}

export default TeamList;
