import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Root} from './containers/Root'
import registerServiceWorker from './registerServiceWorker';
import {configureStore} from "./store/configureStore";

const store = configureStore();

ReactDOM.render(<Root store={store}/>, document.getElementById('root'));
registerServiceWorker();
