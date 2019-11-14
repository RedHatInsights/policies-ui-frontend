[![Build Status](https://travis-ci.org/RedHatInsights/custom-policies-ui-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/custom-policies-ui-frontend)

# custom-policies-ui-frontend

Custom Policies for Red Hat Insights

## Getting Started

There is a [comprehensive quick start guide in the Storybook Documentation](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/quickStart/DOC.md) to setting up an Insights environment complete with:

- Insights Frontend Starter App

- [Insights Chroming](https://github.com/RedHatInsights/insights-chrome)
- [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)

Note: You will need to set up the Insights environment if you want to develop the Custom Policies application due to the consumption of the chroming service as well as setting up the global/app navigation through the API.

For more infor refer to [Insights Frontend Starter App README](https://github.com/RedHatInsights/insights-frontend-starter-app/blob/master/README.md)

## Build app

1. ```yarn```

2. ```yarn start```
    - starts webpack bundler and serves the files with webpack dev server

### Testing

- `yarn verify` will run linters and tests
- Travis is used to test the build for this code.
  - You are always notified on failed builds
  - You are only notified on successful builds if the build before it failed
  - By default, both `push` events as well as `pull_request` events send notifications

## Deploying (Todo: not yet setup)

- The Platform team is using Travis to deploy the application
  - The Platform team will help you set up the Travis instance if this is the route you are wanting to take

## Running locally
Have [insights-proxy](https://github.com/RedHatInsights/insights-proxy) installed under PROXY_PATH

```shell
SPANDX_CONFIG="./profiles/local-frontend.js" bash $PROXY_PATH/scripts/run.sh
```

### Testing - jest

When you want to test your code with unit tests please use `jest` which is preconfigured in a way to colect codecoverage as well. If you want to see your coverage on server the travis config has been set in a way that it will send data to [codecov.io](https://codecov.io) the only thing you have to do is visit their website (register), enable your repository and add CODECOV_TOKEN to your travis web config (do not add it to .travis file, but trough [travis-ci.org](https://travis-ci.org/))
