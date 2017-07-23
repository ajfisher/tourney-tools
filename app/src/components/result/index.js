import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { Button, Container, Modal } from 'semantic-ui-react'

import { TeamSwatch } from "../team";

class Result extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    };

    handle_open = (e) => {

        ReactGA.event({
            category: 'match',
            action: 'Set Result',
        });

        this.setState({ open: true });

    }

    handle_close = (e, data) => this.setState({ open: false });

    handle_win = (winner) => (e) => {

        let loser = (winner === this.props.teamA) ? this.props.teamB : this.props.teamA;

        this.props.onWinResult({
            match_id: this.props.match.id,
            winner_id: winner.id,
            loser_id: loser.id,
        });

        this.setState({ open:false });
    };

    handle_draw = (e) => {
        this.props.onDrawResult(this.props.match.id);
        this.setState({ open: false});
    };

    render() {

        const team_a = this.props.teamA;
        const team_b = this.props.teamB;

        const trigger_text = this.props.match.result.resulted ? "Update result" : "Record result";

        let draw_btn = null;

        if (this.props.allowDraw) {
            draw_btn = <Button basic size="huge" onClick={ this.handle_draw }>
                            <TeamSwatch name={team_a.name} avatar={team_a.avatar} />
                            Draw
                            <TeamSwatch name={team_b.name} avatar={team_b.avatar} />
                        </Button>
        }

        return (
            <Modal
                dimmer="blurring"
                open={this.state.open}
                trigger={
                        <Button basic fluid onClick={this.handle_open}>{ trigger_text }</Button>
                }
                onClose={this.handle_close}
            >
                <Modal.Header>Select the winner of the match or indicate a draw</Modal.Header>
                <Modal.Actions>
                    <Container textAlign="center">
                        <Button basic size="huge"
                            onClick={ this.handle_win(team_a) }
                        >
                            <TeamSwatch name={team_a.name} avatar={team_a.avatar} />
                            { team_a.name } wins
                        </Button>
                        <Button basic size="huge"
                            onClick={ this.handle_win(team_b) }
                        >
                            <TeamSwatch name={team_b.name} avatar={team_b.avatar} />
                            { team_b.name } wins
                        </Button>
                        { draw_btn }
                    </Container>
                </Modal.Actions>
            </Modal>
        );
    };
}

export default Result;
