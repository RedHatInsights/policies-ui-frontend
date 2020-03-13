import { DeepReadonly } from 'ts-essentials';
import { getInsights } from '../utils/Insights';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/custom-policies/${apiVersion}`;

const withBaseUrl = (path: string) => `${apiBaseUrl}/${path}`;
const localUrl = (path: string): Promise<string> => {
    return getInsights().then((insights) => {
        if (insights.chrome.isBeta()) {
            return `/beta${path}`;
        }

        return path;
    });
};

const Config = {
    appId: 'custom-policies',
    apis: {
        version: apiVersion,
        urls: {
            base: apiBaseUrl,
            facts: withBaseUrl('facts'),
            policies: withBaseUrl(`policies`),
            validateCondition: withBaseUrl('policies/validate'),
            policy: (policyId: string | number): string => withBaseUrl(`policies/${policyId}`),
            settings: withBaseUrl('settings')
        }
    },
    pages: {
        emailPreferences: () => localUrl('/settings/applications/custom-policies')
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
