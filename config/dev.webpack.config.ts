import config from '@redhat-cloud-services/frontend-components-config';
import federatedModules from '@redhat-cloud-services/frontend-components-config/federated-modules';
import { resolve } from 'path';

import { updateTsLoaderRule } from './common.webpack.config';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true,
    useProxy: true,
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    appUrl: process.env.BETA ? [ '/beta/insights/policies', '/preview/insights/policies' ] : '/insights/policies',
    env: process.env.BETA ? 'stage-beta' : 'stage-stable'
});

plugins.push(
    federatedModules(
        {
            root: resolve(__dirname, '../'),
            exposes: {
                './RootApp': resolve(__dirname, '../src/AppEntry')
            },
            // exclude: [ 'react-router-dom' ],
            shared: [
                {
                    'react-router-dom': {
                        singleton: true,
                        requiredVersion: '*'
                    }
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
