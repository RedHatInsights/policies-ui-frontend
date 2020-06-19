import { DeepReadonly } from 'ts-essentials';
import { Insights } from '../types/Insights';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/policies/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;
export const localUrl = (insights: Insights, path: string): string => {
    if (insights.chrome.isBeta()) {
        return `/beta${path}`;
    }

    return path;
};

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
        emailPreferences: (insights: Insights) => localUrl(insights, '/user-preferences/email'),
        hooks: (insights: Insights) => localUrl(insights, '/settings/hooks'),
        // eslint-disable-next-line max-len
        factsDocumentation: 'https://access.redhat.com/documentation/en-us/red_hat_insights/2020-04/html/monitoring_and_reacting_to_configuration_changes_using_policies/appendix-policies#facts-and-functions'
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
