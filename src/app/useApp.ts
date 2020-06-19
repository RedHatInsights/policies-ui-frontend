import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Rbac } from '../types/Rbac';
import Config from '../config/Config';
import { fetchRBAC } from '../utils/RbacUtils';
import { AppContext } from './AppContext';
import { useUserSettings } from './useUserSettings';
import { Insights } from '../types/Insights';

declare const insights: Insights | undefined;

const waitForInsights = (): Promise<Insights> => {
    return new Promise<Insights>(async (resolve) => {
        while (!global.hasOwnProperty('insights')) {
            await new Promise(timeout => setTimeout(timeout, 250));
        }

        resolve(insights);
    });
};

export const useApp = (): Omit<AppContext, 'rbac' | 'insights'> & Partial<Pick<AppContext, 'rbac' | 'insights'>> => {

    const history = useHistory();
    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);
    const userSettings = useUserSettings(15 * 60 * 1000);

    useEffect(() => {
        waitForInsights().then((insights) => {
            insights.chrome.init();
            insights.chrome.identifyApp(Config.appId);
        });
        return () => {
            if (insights) {
                insights.chrome.on('APP_NAVIGATION', (event: any) => history.push(`/${event.navId}`));
            }
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
        userSettings,
        insights
    };
};
