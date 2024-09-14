import { fetchRBAC, Rbac, waitForInsights } from '@redhat-cloud-services/insights-common-typescript';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Config from '../config/Config';
import { AppContext } from './AppContext';
import { useUserSettings } from './useUserSettings';

export const useApp = (): Omit<AppContext, 'rbac'> & Partial<Pick<AppContext, 'rbac'>> => {

    const location = useLocation();
    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);
    const userSettings = useUserSettings(15 * 60 * 1000);

    useEffect(() => {
        waitForInsights().then((insights) => {
            insights.chrome.identifyApp(Config.appId);
            if (insights.chrome.hasOwnProperty('hideGlobalFilter') && (insights.chrome as any).hideGlobalFilter) {
                (insights.chrome as any).hideGlobalFilter();
            }
        });
    }, [ location ]);

    useEffect(() => {
        waitForInsights().then(insights => {
            insights.chrome.auth.getUser().then(() => {
                fetchRBAC(Config.appId).then(setRbac);
            });
        });
    }, []);

    return {
        rbac: rbac ? {
            canReadPolicies: rbac.hasPermission('policies', 'policies', 'read'),
            canWritePolicies: rbac.hasPermission('policies', 'policies', 'write')
        } : undefined,
        userSettings
    };
};
