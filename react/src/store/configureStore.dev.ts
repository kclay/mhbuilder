import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from '../reducers';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';


/**
 * Entirely optional, this tiny library adds some functionality to
 * your DevTools, by logging actions/state to your console. Used in
 * conjunction with your standard DevTools monitor gives you great
 * flexibility!
 */
const logger = createLogger();


const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;
const finalCreateStore = composeEnhancers(
    // Middleware you want to use in development:
    applyMiddleware(logger, thunk),
    // Required! Enable Redux DevTools with the monitors you chose
//    DevTools.instrument()
)(createStore);


export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState);

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers'))
        );
    }

    return store;
}
