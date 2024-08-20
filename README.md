[![Build Status](https://travis-ci.org/RedHatInsights/policies-ui-frontend.svg?branch=master)](https://travis-ci.com/RedHatInsights/policies-ui-frontend)

# policies-ui-frontend
Policies frontend for Red Hat Insights

## First time setup
1. Make sure you have [`Node.js`](https://nodejs.org/en/) version >= 18 installed
2. Make sure you have [`yarn`](https://classic.yarnpkg.com/lang/en/docs/install/) installed
3. Run [script to patch your `/etc/hosts`](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh)
4. Make sure you are using [Red Hat proxy](http://hdn.corp.redhat.com/proxy.pac)

## Running locally
1. Make sure you are connected to the Red Hat VPN
2. Install dependencies with `yarn install`
3. Run development server with `yarn start`
4. Local version of the app will be available at URL printed out to the console (https://stage.foo.redhat.com:1337/insights/policies/)

## Testing
[Cypress](https://cypress.io/) is used as the testing framework
- ```yarn run test``` - run all Cypress tests
- ```yarn run lint``` - run linter

## Deploying
The app uses containerized builds which are configured in [`app-interface`](https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/insights/policies/deploy-clowder.yml).

| Environment | Available at                     | Deployed version
| :---------- | :--------------------------------| :----------
| stage       | https://console.stage.redhat.com | master branch
| production  | https://console.redhat.com       | up to the commit configured in `app-interface`

## Tools

> [!CAUTION]
> This section is outdated and things might not work properly.

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
