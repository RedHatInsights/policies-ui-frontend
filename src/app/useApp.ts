import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { fetchRBAC, Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Config from '../config/Config';
import { AppContext } from './AppContext';
import { useUserSettings } from './useUserSettings';

export const useApp = (): Omit<AppContext, 'rbac'> & Partial<Pick<AppContext, 'rbac'>> => {

    const navigate = useNavigate();
    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);
    const userSettings = useUserSettings(15 * 60 * 1000);

    const chrome = useChrome();

    useEffect(() => {
        chrome.init();
        chrome.identifyApp(Config.appId);
        if (chrome.hasOwnProperty('hideGlobalFilter') && (chrome as any).hideGlobalFilter) {
            (chrome as any).hideGlobalFilter();
        }
    }, [ navigate ]);

    useEffect(() => {
        chrome.auth.getUser().then(() => {
            fetchRBAC(Config.appId).then((args)=> {
                console.log(args, "argssss");
            }).catch((e) => {
                console.log(e, "errorrrr");
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
