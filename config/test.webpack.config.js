import { resolve } from 'path';
import * as config from '@redhat-cloud-services/frontend-components-config';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

module.exports = {
    ...webpackConfig,
    plugins
};
