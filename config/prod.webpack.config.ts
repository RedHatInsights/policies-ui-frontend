import config from '@redhat-cloud-services/frontend-components-config';
import { resolve } from 'path';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

module.exports = {
    ...webpackConfig,
    plugins
};
