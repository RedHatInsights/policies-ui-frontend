import * as React from 'react';
import { createClient, ClientContextProvider } from 'react-fetching-library';
import { RouteComponentProps, withRouter } from 'react-router';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import { fetchRBAC } from '../utils/RbacUtils';
import { RbacContext } from '../components/RbacContext';
import { Routes } from '../Routes';
import { AppSkeleton } from '../components/AppSkeleton/AppSkeleton';

declare const insights: any;

interface Account {
    accountNumber: string;
    username: string;
}

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { Rbac } from '../types/Rbac';

const App: React.FunctionComponent<RouteComponentProps> = (props) => {

    const [ _account, setAccount ] = React.useState<Account | undefined>(undefined);
    const [ rbac, setRbac ] = React.useState<Rbac | undefined>(undefined);

    React.useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('custom-policies');
        const appNav = insights.chrome.on('APP_NAVIGATION', (event: any) => props.history.push(`/${event.navId}`));
        return () => {
            appNav();
        };
    }, []);

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

    console.log(rbac);

    return (
        <ClientContextProvider client={ createClient() }>
            <RbacContext.Provider value={ rbac }>
                <NotificationsPortal/>
                <Routes/>
            </RbacContext.Provider>
        </ClientContextProvider>
    );
};

export default withRouter(App);
