import * as React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { RouteComponentProps, withRouter } from 'react-router';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import Config from '../config/Config';
import { fetchRBAC } from '../utils/RbacUtils';
import { RbacContext } from '../components/RbacContext';
import { Routes } from '../Routes';
import { AppSkeleton } from '../components/AppSkeleton/AppSkeleton';
import { client } from './FetchingConfiguration';

import '@redhat-cloud-services/frontend-components/index.css';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { Rbac } from '../types/Rbac';
import { getInsights } from '../utils/Insights';

const App: React.FunctionComponent<RouteComponentProps> = (props) => {

    const [ rbac, setRbac ] = React.useState<Rbac | undefined>(undefined);

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
        <ClientContextProvider client={ client }>
            <RbacContext.Provider value={ rbac }>
                <NotificationsPortal/>
                <Routes/>
            </RbacContext.Provider>
        </ClientContextProvider>
    );
};

export default withRouter(App);
