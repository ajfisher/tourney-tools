import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react'

class Result extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    };

    handle_open = (e) => {
        this.setState({ open: true });
    };

    handle_close = (e, data) => {
        this.setState({ open: false });
    };

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

        return (
            <Modal
                dimmer="blurring"
                open={this.state.open}
                trigger={
                        <Button basic fluid onClick={this.handle_open}>{ trigger_text }</Button>
                }
                onClose={this.handle_close}
            >
                <Modal.Header>Record the result</Modal.Header>
                <Modal.Content>
                    Select the winner of the match or indicate a draw
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="blue"
                        onClick={ this.handle_win(team_a) }
                    >
                        { team_a.name } win
                    </Button>
                    <Button
                        color="yellow"
                        onClick={ this.handle_win(team_b) }
                    >
                        { team_b.name } win
                    </Button>
                    <Button onClick={ this.handle_draw }>
                        Draw
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

}

export default Result;

