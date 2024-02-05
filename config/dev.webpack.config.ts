/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-nocheck
const { resolve } = require('path');

const { updateTsLoaderRule } = require('./common.webpack.config');

const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true,
    useProxy: true,
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    appUrl: process.env.BETA ? [ '/beta/insights/policies', '/preview/insights/policies' ] : '/insights/policies',
    env: process.env.BETA ? 'stage:beta' : 'stage-stable'
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')(
        {
            root: resolve(__dirname, '../'),
            exposes: {
                './RootApp': resolve(__dirname, '../src/AppEntry'),
            },
            shared: [
                {
                    'react-router-dom': { singleton: true, requiredVersion: '*' }
                }
            ]
        }
    )
);

updateTsLoaderRule(webpackConfig.module.rules);

module.exports = {
    ...webpackConfig,
    plugins
};
