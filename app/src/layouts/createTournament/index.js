import _ from 'lodash';
import React, { Component } from 'react';
import { Container, Form, Header, Input} from 'semantic-ui-react';

class CreateTournament extends Component {
    // sets up the create Tournament Form.

    handle_submit = e => {
        // now we get all of the data and batch it up
        e.preventDefault();
        console.log("in here processing the form");
        console.log(this.refs);
        console.log(this.refs.official.inputRef.value);

        let new_tournament = {};
        let validated = true;

        _.forEach(this.refs, (field, key) => {
            if (! field.inputRef.value) {
                validated = false;
            } else {
                new_tournament[key] = field.inputRef.value;
            }
        });

        if (validated) {
            const options = {
                method: 'POST',
                body: JSON.stringify(new_tournament),
            }

            const url = "/api/tournament/";

            let request = new Request(url, options);

            console.log(request);
            // get the tournament data from the server
            fetch(request).then((res) => {
                if (! res.ok) {
                    throw new Error(res.json());
                } else {
                    return res.json();
                }
            }).then((data) => {
                console.log(data);
            });
        } else {
            console.log("post the error view back");
        }
    }

    render() {
        return (
            <Container className="create">
                <Header as="h1">Create a new tournament</Header>

                <Form size="huge" onSubmit={ this.handle_submit }>
                    <p>To create a new tournament, please fill in the details
                    below. All fields are required</p>

                    <Form.Field width="10">
                        <Input label="Event name" name="name"
                            ref="name"
                            placeholder="What is the name of your tournament / event?"
                            type="text">

                        </Input>
                    </Form.Field>
                    <Form.Field width="10">
                        <Input label="Your name" name="official" ref="official"
                            placeholder="Your name or the name of the organiser?"
                            type="text" />
                    </Form.Field>
                    <Form.Field width="6">
                        <Input label="Date" name="date" ref="date"
                            type="date" />
                    </Form.Field>
                    <Form.Field width="4">
                        <Input label="Teams" placeholder="#" type="number"
                            name="no_team" ref="no_teams"/>
                    </Form.Field>
                    <Form.Button content="Create tournament" size="huge" type="submit" />
                </Form>
            </Container>
        );
    }
}

export default CreateTournament;
