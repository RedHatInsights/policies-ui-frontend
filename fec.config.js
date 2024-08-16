const { resolve } = require('path');
const packageJson = require('./package.json');

const bundle = 'insights';
const appName = packageJson[bundle].appname;

module.exports = {
  appName,
  appUrl: `/${bundle}/${appName}`,
  useProxy: process.env.PROXY === 'true',
  debug: true,
  proxyVerbose: true,
  moduleFederation: {
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: packageJson.dependencies['react-router-dom'],
          requiredVersion: '>=6.0.0 <7.0.0',
        },
      },
    ],
    exposes: {
      './RootApp': resolve(
        __dirname,
        `/src/AppEntry`
      ),
    },
  }
};
