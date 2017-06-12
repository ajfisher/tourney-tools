import React, { Component } from 'react';
import Moment from 'moment';

class DateFormat extends Component {

    render() {

        const date = Moment(this.props.date);

        return (
            <date>
                { date.format("MMMM Do YYYY") }
            </date>
        )
    }
}

export default DateFormat;
