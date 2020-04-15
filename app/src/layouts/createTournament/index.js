import _ from 'lodash';
import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { Button, Container, Dimmer, Form, Header, Input, Loader} from 'semantic-ui-react';

//const api_root = "https://c4ekmno7s8.execute-api.ap-southeast-2.amazonaws.com/dev";
const api_root = "/dev";

class CreateTournament extends Component {
    // sets up the create Tournament Form.

    constructor(props) {
        super(props);

        let viewport_width = "small";

        if (window.innerWidth > 1000) {
            viewport_width = "wide";
        } else if (window.innerWidth > 480) {
            viewport_width = "medium";
        }
        // use mode to determine if we're in `create` or `review` mode
        // to route appropriate response.
        this.state = {
            mode: 'create',
            loading: false,
            viewport_width: viewport_width,
        };
    }


    handleResize = (e) => {
        let viewport_width = "small";

        if (window.innerWidth > 1000) {
            viewport_width = "wide";
        } else if (window.innerWidth > 480) {
            viewport_width = "medium";
        }

        this.setState({	viewport_width: viewport_width });
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    view_tournament = e => {
        // now we simply off load the to the appropriate tournament view

        const { tournament } = this.state;
        let url = "/tournament/" + tournament.id + "/?sk=" + tournament.secret;
        url += "&tutorial=1";
        this.props.history.push(url);
    }

    handle_submit = e => {
        // now we get all of the data and batch it up
        e.preventDefault();
        //console.log("in here processing the form");
        //console.log(this.refs);
        //console.log(this.refs.official.inputRef.value);

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

            this.setState({loading: true});

            const options = {
                method: 'POST',
                body: JSON.stringify(new_tournament),
            }

            const url = api_root + "/tournament/";

            let request = new Request(url, options);

            // get the tournament data from the server
            fetch(request).then((res) => {
                if (! res.ok) {
                    throw new Error(res.json());
                } else {
                    return res.json();
                }
            }).then((data) => {
                //console.log(data);
                this.setState({loading: false, mode: 'review', tournament: data});

            });
        } else {
            this.setState({loading: false});
            console.log("post the error view back");
        }
    }

    render() {

        const { mode, loading } = this.state;

        if (loading) {
            return (
                <Dimmer active>
                    <Loader size="massive">Creating tournament</Loader>
                </Dimmer>
            )
        }

        if (mode === 'create') {

            let formsize = ( this.state.viewport_width === "small") ? "large" : "huge";

            return (
                <Container className="create" as="section" text>
                    <Header as="h1">Create a new tournament { this.state.viewport_width }</Header>

                    <Form size={ formsize } onSubmit={ this.handle_submit }>
                        <p>To create a new tournament, please fill in the details
                        below. All fields are required</p>

                        <Form.Field>
                            <Input label="Event name" name="name"
                                ref="name"
                                placeholder="What is the name of your tournament / event?"
                                type="text">

                            </Input>
                        </Form.Field>
                        <Form.Field>
                            <Input label="Your name" name="official" ref="official"
                                placeholder="Your name or the name of the organiser?"
                                type="text" />
                        </Form.Field>
                        <Form.Field>
                            <Input label="Date" name="date" ref="date"
                                type="date" />
                        </Form.Field>
                        <Form.Field>
                            <Input label="Teams" placeholder="#" type="number"
                                name="no_team" ref="no_teams"/>
                        </Form.Field>
                        <Form.Button content="Create tournament" size="huge" type="submit" primary />
                    </Form>
                </Container>
            );
        }


        if (mode === 'review') {
            const { tournament } = this.state;
            const {host, protocol } = window.location;

            ReactGA.pageview('/tournament/create/complete');

            return (
                <Container className="review" as="section">
                    <Header as="h1">Your tournament has been created</Header>
                    <p>The tournament has been made and now you are ready to
                    start customising the teams and running the matches.</p>
                    <p>The links below will take you to your tournament page.
                    Give the Share Link to anyone you want to
                    follow the tournament results. The Edit Link
                    will unlock the tournament and allow anyone to update the
                    details so share it with care.</p>
                    <Header as="h2">Share link</Header>
                    <p>{protocol + "//" + host }/tournament/{tournament.id}</p>
                    <Header as="h2">Edit link</Header>
                    <p>{protocol + "//" + host }/tournament/{tournament.id}/?sk={tournament.secret}</p>

                    <Button
                        size="huge" icon='right arrow' labelPosition='right'
                        primary
                        content="Go to the tournament screen"
                        onClick={ this.view_tournament }
                    />
               </Container>
            )
        }



    }
}

export default CreateTournament;
