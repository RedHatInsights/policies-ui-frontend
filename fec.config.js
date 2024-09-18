const { resolve } = require('path');
const packageJson = require('./package.json');

module.exports = {
    appUrl: '/insights/policies',
    debug: true,
    useProxy: process.env.PROXY === 'true',
    proxyVerbose: true,
    interceptChromeConfig: false,
    plugins: [],
    hotReload: process.env.HOT === 'true',
    moduleFederation: {
        shared: [
            {
                'react-router-dom': {
                    singleton: true,
                    import: false,
                    version: packageJson.dependencies['react-router-dom'],
                    requiredVersion: '>=6.0.0 <7.0.0'
                }
            }
        ],
        exposes: {
            './RootApp': resolve(
                __dirname,
                `/src/AppEntry`
            )
        }
    }
};
