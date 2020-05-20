import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Rbac } from '../types/Rbac';
import { getInsights, waitForInsights } from '../utils/Insights';
import Config from '../config/Config';
import { fetchRBAC } from '../utils/RbacUtils';
import { AppContext } from './AppContext';
import { useUserSettings } from './useUserSettings';

export const useApp = (): Omit<AppContext, 'rbac'> & Partial<Pick<AppContext, 'rbac'>> => {

    const history = useHistory();
    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);
    const userSettings = useUserSettings(15 * 60 * 1000);

    useEffect(() => {
        waitForInsights().then((insights) => {
            insights.chrome.init();
            insights.chrome.identifyApp(Config.appId);
        });
        return () => {
            const insights = getInsights();
            insights.chrome.on('APP_NAVIGATION', (event: any) => history.push(`/${event.navId}`));
        };
    }, [ history ]);

    useEffect(() => {
        waitForInsights().then(insights => {
            insights.chrome.auth.getUser().then(() => {
                fetchRBAC().then(setRbac);
            });
        });
    }, []);

    return {
        rbac,
        userSettings
    };
};
