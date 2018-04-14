/**
 * Based on the current environment variable, we need to make sure
 * to exclude any DevTools-related code from the production builds.
 * The code is envify'd - using 'DefinePlugin' in Webpack.
 */

let loadedStore = null;

if (process.env.NODE_ENV === 'production') {
    loadedStore = require('./configureStore.prod').default;
} else {
    loadedStore = require('./configureStore.dev').default;
}

export const configureStore = loadedStore;
export default configureStore;