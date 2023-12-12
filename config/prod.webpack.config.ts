import config from '@redhat-cloud-services/frontend-components-config';
import federatedModules from '@redhat-cloud-services/frontend-components-config/federated-modules';
import { resolve } from 'path';

import { updateTsLoaderRule } from './common.webpack.config';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    deployment: process.env.BETA ? 'beta/apps' : 'apps'
});

plugins.push(
    federatedModules(
        {
            root: resolve(__dirname, '../'),
            exclude: [ 'react-router-dom' ]
        }
    )
);

updateTsLoaderRule(webpackConfig.module.rules);

module.exports = {
    ...webpackConfig,
    plugins
};
