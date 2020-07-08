import { DeepReadonly } from 'ts-essentials';
import { getInsights, localUrl } from '@redhat-cloud-services/insights-common-typescript';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/policies/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

const Config = {
    appId: 'policies',
    apis: {
        version: apiVersion,
        urls: {
            base: apiBaseUrl,
            userSettings: {
                email: withBaseUrl('/user-config/email-preference')
            }
        }
    },
    pages: {
        emailPreferences: () => localUrl('/user-preferences/email', getInsights().chrome.isBeta()),
        hooks: () => localUrl('/settings/hooks', getInsights().chrome.isBeta()),
        // eslint-disable-next-line max-len
        factsDocumentation: 'https://access.redhat.com/documentation/en-us/red_hat_insights/2020-04/html/monitoring_and_reacting_to_configuration_changes_using_policies/appendix-policies#facts-and-functions'
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
