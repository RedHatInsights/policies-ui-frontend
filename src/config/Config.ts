import { DeepReadonly } from 'ts-essentials';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/custom-policies/${apiVersion}`;

const withBaseUrl = (path: string) => `${apiBaseUrl}/${path}`;

const Config = {
    apis: {
        version: apiVersion,
        urls: {
            base: apiBaseUrl,
            facts: withBaseUrl('facts'),
            policies: (customerId: string) => withBaseUrl(`policies/${customerId}`),
            customerPolicy: (customerId: string, policyId: string) => withBaseUrl(`policies/${customerId}/policy/${policyId}`)
        }
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
