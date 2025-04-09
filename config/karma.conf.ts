import config from '@redhat-cloud-services/frontend-components-config';
import isCi from 'is-ci';
import { resolve } from 'path';

import { updateTsLoaderRule } from './common.webpack.config';

if (isCi) {
    console.log(`Karma is running in CI environment, disabling watching files and doing a single run.`);
}

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '..')
});

updateTsLoaderRule(webpackConfig.module.rules);

const browsers = () => {
    const browserList = [ 'Chrome', 'Firefox' ];
    if (isCi) {
        return browserList.map(b => `${b}Headless`);
    }

    return browserList;
};

const singleRun = () => {
    return isCi;
};

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [ 'jasmine' ],

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'test/SmokeTest.tsx', watched: false }
        ],

        // list of files / patterns to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'test/SmokeTest.tsx': [ 'webpack' ]
        },

        webpack: {
            ...webpackConfig,
            plugins,
            module: {
                ...webpackConfig.module,
                rules: [
                    ...webpackConfig.module.rules,
                    {
                        test: /test\/.*\.tsx?$/,
                        loader: 'ts-loader',
                        exclude: /(node_modules)/i
                    }
                ]
            },
            watch: !isCi,
            watchOptions: isCi ? {
                ignored: /node_modules/
            } : {}
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'progress' ],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: !isCi,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: browsers(),

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: singleRun(),

        client: {

        },

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: 4
    });
};
