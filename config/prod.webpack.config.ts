import config from '@redhat-cloud-services/frontend-components-config';
import federatedModules from '@redhat-cloud-services/frontend-components-config/federated-modules';
import { resolve } from 'path';

import { updateTsLoaderRule } from './common.webpack.config';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

plugins.push(
    federatedModules(
        {
            root: resolve(__dirname, '../'),
            shared: [
                {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
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
