//@ts-nocheck
import config from '@redhat-cloud-services/frontend-components-config';
import { resolve } from 'path';

import { updateTsLoaderRule } from './common.webpack.config';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

updateTsLoaderRule(webpackConfig.module.rules);

module.exports = {
    ...webpackConfig,
    plugins
};
