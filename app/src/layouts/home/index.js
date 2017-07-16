import React, { Component } from 'react';

import { Button, Container } from 'semantic-ui-react';

class Home extends Component {

    create_tournament = e => {
        // redirect out to the creation screen
        this.props.history.push("/tournament/create");
    }

    render() {
        return (
            <Container text className="homecontent" as="section">
                <h1>Manage your tournament</h1>
                <p>Sick of chasing pieces of paper with results scrawled on them
                or managing complex Excel spreadsheets just to work out who
                got the most points in a competition</p>
                <h2>Introducing Tournament Tools</h2>
                <p>A simple web application that allows you to create a tournament,
                manage teams, allocate pool groups and record results until you
                find a winner.</p>
                <p>Perfect for casual tournaments at school or community events
                that occur in one place such as robot battles, indoor sports or
                board games.</p>
                <p>And did we mention it's free to use?</p>
                <Button
                    size="massive" primary
                    content="Create a tournament now"
                    onClick={ this.create_tournament }
                />
            </Container>
        );
    }
}

export default Home;
