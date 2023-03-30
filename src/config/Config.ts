import { getInsights, localUrl } from '@redhat-cloud-services/insights-common-typescript';
import { DeepReadonly } from 'ts-essentials';

import { ActionType } from '../types/Policy';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/policies/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

const Config = {
    appId: 'policies',
    defaultElementsPerPage: 20,
    allowedActions: {
        normal: [
            ActionType.NOTIFICATION
        ],
        fedramp: [
            ActionType.NOTIFICATION
        ]
    },
    apis: {
        version: apiVersion,
        urls: {
            base: apiBaseUrl,
            userSettings: {
                email: withBaseUrl('/user-config/preferences')
            }
        }
    },
    pages: {
        emailPreferences: () => localUrl('/user-preferences/notifications/insights', getInsights().chrome.isBeta()),
        notifications: () => localUrl('/settings/notifications/rhel', getInsights().chrome.isBeta()),
        // eslint-disable-next-line max-len
        factsDocumentation: 'https://access.redhat.com/documentation/en-us/red_hat_insights/2022/html/monitoring_and_reacting_to_configuration_changes_using_policies/assembly-policies-monitoring-appendix-ref-materials#ref-policies-monitoring-appendix-system-facts_policies-monitoring-appendix-ref-materials'
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
