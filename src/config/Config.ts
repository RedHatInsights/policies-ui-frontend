import { DeepReadonly } from 'ts-essentials';
import { getInsights } from '../utils/Insights';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/policies/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}/${path}`;
export const localUrl = (path: string): string => {
    const insights = getInsights();
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
            facts: withBaseUrl('facts'),
            policies: withBaseUrl(`policies`),
            validateCondition: withBaseUrl('policies/validate'),
            validatePolicyName: withBaseUrl('policies/validate-name'),
            policy: (policyId: string): string => withBaseUrl(`policies/${policyId}`),
            policyEnabled: (policyId: string) => withBaseUrl(`policies/${policyId}/enabled`),
            policyIds: withBaseUrl('policies/ids'),
            policyIdsEnabled: withBaseUrl('policies/ids/enabled'),
            userSettings: {
                email: withBaseUrl('user-config/email-preference')
            }
        }
    },
    pages: {
        emailPreferences: () => localUrl('/user-preferences/email'),
        hooks: () => localUrl('/settings/hooks'),
        // eslint-disable-next-line max-len
        factsDocumentation: 'https://access.redhat.com/documentation/en-us/red_hat_insights/2020-04/html/monitoring_and_reacting_to_configuration_changes_using_policies/appendix-policies#facts-and-functions'
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
