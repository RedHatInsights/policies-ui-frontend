import * as React from 'react';
import { createClient, ClientContextProvider } from 'react-fetching-library';
import { RouteComponentProps, withRouter } from 'react-router';
import { Routes } from '../Routes';
import { AppSkeleton } from '../components/AppSkeleton/AppSkeleton';

declare const insights: any;

interface Account {
  accountNumber: string;
  username: string;
}

const App: React.FunctionComponent<RouteComponentProps> = (props) => {

    const [ account, setAccount ] = React.useState<Account | undefined>(undefined);

    React.useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('custom-policies');
        const appNav = insights.chrome.on('APP_NAVIGATION', (event: any) => props.history.push(`/${event.navId}`));
        return () => {
            appNav();
        };
    });

    React.useEffect(() => {
        insights.chrome.auth.getUser().then((userAccount: any) => {
            setAccount({
                accountNumber: userAccount.identity.account_number,
                username: userAccount.identity.username
            });
        });
    });

    if (!account) {
        return (
            <AppSkeleton/>
        );
    }

    return (
        <ClientContextProvider client={ createClient() }>
            <Routes/>
        </ClientContextProvider>
    );
};

export default withRouter(App);
