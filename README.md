[![Build Status](https://travis-ci.org/RedHatInsights/custom-policies-ui-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/custom-policies-ui-frontend)

# custom-policies-ui-frontend

Custom Policies frontend for Red Hat Insights


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

## Running locally

To run locally, we need the following:

1. Run insights proxy
2. Run `custom-policies-ui-frontend` application.

### Running insights proxy

In order to run it locally, you need to have
[insights-proxy](https://github.com/RedHatInsights/insights-proxy) repository placed under PROXY_PATH.
Start the proxy by running:

```shell
yarn proxy
```

### Running custom-policies-ui-frontend

Install the dependencies:

```shell
yarn
```

and run the application:

```shell
yarn start
```

After that, you can head to the [dev page](https://ci.foo.redhat.com:1337/beta/insights/custom-policies) or
the [prod page](https://prod.foo.redhat.com:1337/beta/insights/custom-policies).

You will likely need to accept the certificates of these pages and the
[websocket page](https://localhost:8002/sockjs-node/info)

For more info refer to [Insights Frontend Starter App README](https://github.com/RedHatInsights/insights-frontend-starter-app/blob/master/README.md)

## Deploying

Deployments come from the `.travis/custom_release.sh` file. Push to certain branches to deploy to certain environments:

### Pushing to master

Anytime a build of the master branch happens, Travis builds and pushes a new commit to the ci-beta & qa-beta branch in your build repo. Pull requests on master will not be deployed until they are merged, but they will be built to assure linting, snapshots, etc. are working as expected.

master -> qa-beta & ci-beta
prod-beta -> prod-beta
master-stable -> qa-stable & ci-stable
prod-stable -> prod-stable

### Testing - jest

When you want to test your code with unit tests please use `jest` which is preconfigured in a way to collect codecoverage as well. If you want to see your coverage on server the travis config has been set in a way that it will send data to [codecov.io](https://codecov.io) the only thing you have to do is visit their website (register), enable your repository and add CODECOV_TOKEN to your travis web config (do not add it to .travis file, but trough [travis-ci.org](https://travis-ci.org/))
