import { resolve } from 'path';
import config from '@redhat-cloud-services/frontend-components-config';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true
});

module.exports = {
    ...webpackConfig,
    plugins
};
