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
2. Serve the modified main.yml
3. Run `custom-policies-ui-frontend` application.

### Running insights proxy

In order to run it locally, you need to have
[insights-proxy](https://github.com/RedHatInsights/insights-proxy) repository placed under PROXY_PATH
To start the proxy by running in your `custom-policies-ui-frontend` directory:

```shell
yarn proxy
```

### Serving modified configuration of Cloud Services

[cloud-services-config](https://github.com/RedHatInsights/cloud-services-config)'s main.yml contains
the source of truth for the Cloud Services apps. For our application, the modified version can
be downloaded from
[here](https://github.com/josejulio/cloud-services-config/blob/custom-policies-ui-frontend/main.yml)
We need to put it under `beta/config`

```shell
mkdir -p cloud-services-config/beta/config
curl https://raw.githubusercontent.com/josejulio/cloud-services-config/custom-policies-ui-frontend/main.yml > cloud-services-config/beta/config/main.yml
```

and start serving with any http server on port 8889.

```shell
npx http-server -p 8889 cloud-services-config
```

Note: This is a temporal step, for more info read
[this](https://github.com/RedHatInsights/cloud-services-config#testing-your-changes-locally).


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
[websocket page](https://localhost:8002/sockjs-node/info?t=1574304329025)

For more info refer to [Insights Frontend Starter App README](https://github.com/RedHatInsights/insights-frontend-starter-app/blob/master/README.md)

### Testing - jest

When you want to test your code with unit tests please use `jest` which is preconfigured in a way to colect codecoverage as well. If you want to see your coverage on server the travis config has been set in a way that it will send data to [codecov.io](https://codecov.io) the only thing you have to do is visit their website (register), enable your repository and add CODECOV_TOKEN to your travis web config (do not add it to .travis file, but trough [travis-ci.org](https://travis-ci.org/))
