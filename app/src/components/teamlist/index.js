import React, { Component } from 'react';

class TeamList extends Component {


    render () {
        console.log(this.props);
        return (
            <div className="teamlist">
                {
                    this.props.teams.map((team, index) => {
                        return <p key={index}>Team: {team.name}</p>
                    })
                }
                <p>This is a team list</p>
            </div>
        );
    }
}

export default TeamList;
