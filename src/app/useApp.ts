import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Rbac } from '../types/Rbac';
import { useUserSettingsEmailQuery } from '../services/useUserSettingsEmailQuery';
import { getInsights, waitForInsights } from '../utils/Insights';
import Config from '../config/Config';
import { fetchRBAC } from '../utils/RbacUtils';
import { AppContext } from './AppContext';

export const useApp = (): Partial<AppContext> => {

    const history = useHistory();
    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);
    const userSettingsEmailQuery = useUserSettingsEmailQuery();

    useEffect(() => {
        const body = document.body;
        waitForInsights().then((insights) => {
            insights.chrome.init();
            insights.chrome.identifyApp(Config.appId);
            body.classList.add('app-policies');
        });
        return () => {
            body.classList.remove('app-policies');
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

    const userSettings = useMemo(() => {
        return userSettingsEmailQuery.payload ? {
            ...userSettingsEmailQuery.payload,
            refresh: userSettingsEmailQuery.query as () => void
        } : undefined;
    }, [ userSettingsEmailQuery.payload, userSettingsEmailQuery.query ]);

    return {
        rbac,
        userSettings
    };
};
