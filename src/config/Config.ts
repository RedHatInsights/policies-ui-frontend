import { DeepReadonly } from 'ts-essentials';
import { getInsights } from '../utils/Insights';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/policies/${apiVersion}`;

const withBaseUrl = (path: string) => `${apiBaseUrl}/${path}`;
const localUrl = (path: string): string => {
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
            policy: (policyId: string): string => withBaseUrl(`policies/${policyId}`),
            policyEnabled: (policyId: string) => withBaseUrl(`policies/${policyId}/enabled`),
            userSettings: {
                email: withBaseUrl('user-config/email-preference')
            }
        }
    },
    pages: {
        emailPreferences: () => localUrl('/user-preferences/email'),
        hooks: () => localUrl('/settings/hooks')
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
