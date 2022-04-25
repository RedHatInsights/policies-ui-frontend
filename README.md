[![Build Status](https://travis-ci.com/RedHatInsights/policies-ui-frontend.svg?branch=master)](https://travis-ci.com/RedHatInsights/policies-ui-frontend)

# policies-ui-frontend

Policies frontend for Red Hat Insights


## Build app

1. ```yarn install```

2. ```yarn start```
    - starts webpack bundler and serves the files with webpack dev server

### Testing

- `yarn verify` will run linters and tests
- Travis is used to test the build for this code.
  - You are always notified on failed builds
  - You are only notified on successful builds if the build before it failed
  - By default, both `push` events as well as `pull_request` events send notifications

## Running locally

You need to configure your `/etc/hosts` to have the hosts for `prod.foo` and `stage.foo`.
Check or execute [this](https://raw.githubusercontent.com/RedHatInsights/insights-proxy/master/scripts/patch-etc-hosts.sh) script for details.

Install the dependencies using `yarn`:

```shell
yarn install
```

If needed set the environment (see below) and then run the application:

```shell
yarn start
```

After that, you can head to the page show (stage by default).
You can set the environment and if you want to use your local development server by copying the file [env.sample](./env.sample) to `.env`
and starting again by calling `yarn start`.

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

## Tools

### Generating types from Openapi file

The ui-frontend depends on types from the ui-backend, these are generated from the Openapi spec file, run `yarn schema` to reload the types.
Generate types can be found in: `src/generated/`, check `package.json` for more info.

### Generating random trigger history

#### Requirements
 - Access to Kafka topic
 - kafkacat installed and in the PATH

#### Usage
Run `yarn pushhost --account <account-number>`.

Use `yarn pushhost --help` for more information. For the data being sent, 
check [src/cli/pushhost.ts](src/cli/pushhost.ts).

You can store the account number in .push-host.env under the `INSIGHTS_ACCOUNT` and omit the argument from the command line if used frequently.

```bash
$ cat .push-host.env 
INSIGHTS_ACCOUNT=940527
```
