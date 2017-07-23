import React, { Component } from 'react';

import Base from '../../layouts/base';

import './styles.css';

class App extends Component {
    render() {

        return (
                <div className="app">
                    <Base className="main" analytics={this.props.analytics} />
                </div>
        );
    }
}

export default App;
