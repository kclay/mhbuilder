import React from 'react';
import {Provider} from 'react-redux';
import App from './App';


/**
 * Component is exported for conditional usage in Root.js
 */
export default class Root extends React.Component<any, any> {
    render() {
        const {store} = this.props;
        return (
            /**
             * Provider is a component provided to us by the 'react-redux' bindings that
             * wraps our app - thus making the Redux store/state available to our 'connect()'
             * calls in component hierarchy below.
             */
            <Provider store={store}>
                <div>
                    <App/>


                </div>
            </Provider>
        );
    }
};