const { resolve } = require('path');
const packageJson = require('./package.json');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

module.exports = {
    appUrl: '/insights/policies',
    debug: true,
    useProxy: process.env.PROXY === 'true',
    proxyVerbose: true,
    interceptChromeConfig: false,
    plugins: [],
    hotReload: process.env.HOT === 'true',
    devtool: 'hidden-source-map',
    plugins: [
        // Put the Sentry Webpack plugin after all other plugins
        ...(process.env.ENABLE_SENTRY
            ? [
                sentryWebpackPlugin({
                    ...(process.env.SENTRY_AUTH_TOKEN && {
                        authToken: process.env.SENTRY_AUTH_TOKEN
                    }),
                    org: 'red-hat-it',
                    project: 'policies-rhel',
                    moduleMetadata: ({ release }) => ({
                        dsn: `https://a9410934c7cf8b0a63576ded76dd6707@o490301.ingest.us.sentry.io/4508683264262144`,
                        org: 'red-hat-it',
                        project: 'policies-rhel',
                        release
                    })
                })
            ]
            : [])
    ],
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
