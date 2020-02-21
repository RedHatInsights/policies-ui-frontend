import { DeepReadonly } from 'ts-essentials';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/custom-policies/${apiVersion}`;

const withBaseUrl = (path: string) => `${apiBaseUrl}/${path}`;

const Config = {
    appId: 'custom-policies',
    apis: {
        version: apiVersion,
        urls: {
            base: apiBaseUrl,
            facts: withBaseUrl('facts'),
            policies: withBaseUrl(`policies`),
            validateCondition: withBaseUrl('policies/validate'),
            policy: (policyId: string | number): string => withBaseUrl(`policies/${policyId}`)
        }
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
