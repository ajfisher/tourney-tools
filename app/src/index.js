import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactGA from 'react-ga';

import App from './components/app/';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './semantic/build/semantic.min.css';

ReactGA.initialize(process.env.REACT_APP_ANALYTICS_ID);

ReactDOM.render(
    <Router>
        <App analytics={ReactGA} />
    </Router>
    ,document.getElementById('root')
);

registerServiceWorker();
