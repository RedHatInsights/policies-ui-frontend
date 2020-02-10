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

declare const insights: any;

interface Account {
    accountNumber: string;
    username: string;
}

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { Rbac } from '../types/Rbac';

const App: React.FunctionComponent<RouteComponentProps> = (props) => {

    const [ , setAccount ] = React.useState<Account | undefined>(undefined);
    const [ rbac, setRbac ] = React.useState<Rbac | undefined>(undefined);

    React.useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp(Config.appId);
        return () => {
            insights.chrome.on('APP_NAVIGATION', (event: any) => props.history.push(`/${event.navId}`));
        };
    }, [ props.history ]);

    React.useEffect(() => {
        insights.chrome.auth.getUser().then((userAccount: any) => {
            setAccount({
                accountNumber: userAccount.identity.account_number,
                username: userAccount.identity.username
            });
            fetchRBAC().then(setRbac);
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
