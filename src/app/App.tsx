import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import Config from '../config/Config';
import { fetchRBAC } from '../utils/RbacUtils';
import { Routes } from '../Routes';
import { AppSkeleton } from '../components/AppSkeleton/AppSkeleton';

import '@redhat-cloud-services/frontend-components/index.css';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { Rbac } from '../types/Rbac';
import { getInsights } from '../utils/Insights';
import { AppContext } from './AppContext';
import { useUserSettingsQuery } from '../services/useUserSettingsQuery';

const App: React.FunctionComponent<RouteComponentProps> = (props) => {

    const [ rbac, setRbac ] = React.useState<Rbac | undefined>(undefined);
    const userSettingsQuery = useUserSettingsQuery();

    React.useEffect(() => {
        getInsights().then((insights) => {
            insights.chrome.init();
            insights.chrome.identifyApp(Config.appId);
        });
        return () => {
            getInsights().then((insights) => {
                insights.chrome.on('APP_NAVIGATION', (event: any) => props.history.push(`/${event.navId}`));
            });
        };
    }, [ props.history ]);

    React.useEffect(() => {
        getInsights().then(insights => {
            insights.chrome.auth.getUser().then(() => {
                fetchRBAC().then(setRbac);
            });
        });
    }, []);

    if (!rbac) {
        return (
            <AppSkeleton/>
        );
    }

    return (
        <AppContext.Provider value={ {
            rbac,
            userSettings: userSettingsQuery.payload ? { ...userSettingsQuery.payload, refresh: userSettingsQuery.query as () => void } : undefined
        } }>
            <NotificationsPortal/>
            <Routes/>
        </AppContext.Provider>
    );
};

export default withRouter(App);
