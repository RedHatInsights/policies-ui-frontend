import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { fetchRBAC, Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { useEffect, useState } from 'react';

import Config from '../config/Config';
import { AppContext } from './AppContext';
import { useUserSettings } from './useUserSettings';

export const useApp = (): Omit<AppContext, 'rbac'> & Partial<Pick<AppContext, 'rbac'>> => {

    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);
    const userSettings = useUserSettings(15 * 60 * 1000);

    const chrome = useChrome();

    useEffect(() => {
        if (chrome.hasOwnProperty('hideGlobalFilter') && (chrome as any).hideGlobalFilter) {
            (chrome as any).hideGlobalFilter();
        }
    }, []);

    useEffect(() => {
        chrome.auth.getUser().then(() => {
            fetchRBAC(Config.appId).then(setRbac);
        });
    }, [ chrome.auth ]);

    return {
        rbac: rbac ? {
            canReadPolicies: rbac.hasPermission('policies', 'policies', 'read'),
            canWritePolicies: rbac.hasPermission('policies', 'policies', 'write')
        } : undefined,
        userSettings
    };
};
