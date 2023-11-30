import config from '@redhat-cloud-services/frontend-components-config';
import federatedModules from '@redhat-cloud-services/frontend-components-config/federated-modules';
import { resolve } from 'path';

import { apiRoutes } from './api-routes';
import { updateTsLoaderRule } from './common.webpack.config';

const env = () => {
    const type = process.env.USE_PROD ? 'prod' : 'stage';
    const stable = process.env.BETA ? 'beta' : 'stable';
    return `${type}-${stable}`;
};

const routes = () => {
    return process.env.USE_CUSTOM_ROUTES ? apiRoutes : undefined;
};

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true,
    useFileHash: false,
    useProxy: true,
    appUrl: process.env.BETA ? [ '/beta/insights/policies', '/preview/insights/policies' ] : '/insights/policies',
    env: env(),
    routes: routes(),
    useChromeTemplate: true
});

webpackConfig.devtool = 'eval-cheap-module-source-map';

plugins.push(
    federatedModules(
        {
            root: resolve(__dirname, '../'),
            debug: true,
            useFileHash: false,
            exclude: [ 'react-router-dom' ]
        }
    )
);

updateTsLoaderRule(webpackConfig.module.rules);

module.exports = {
    ...webpackConfig,
    plugins
};
