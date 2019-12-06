import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Routes } from '../Routes';
import { CpCxProvider } from '../utils/CPContext';

declare const insights: any;

class App extends React.PureComponent<RouteComponentProps> {

    appNav: any;
    state: {
        accountNumber: string;
        username: string;
    } = { accountNumber: '', username: '' };

    componentDidMount() {
        insights.chrome.init();
        insights.chrome.identifyApp('custom-policies');
        insights.chrome.auth.getUser().then((value: any) =>
        {
            console.log('App auth data ' + value.identity.account_number);
            // this.context.accountNumber = value.identity.account_number;
            // this.context.username = value.identity.user.username;
            this.setState({ accountNumber: value.identity.account_number,
                username: value.identity.user.username });

        });
        this.appNav = insights.chrome.on('APP_NAVIGATION', (event: any) => this.props.history.push(`/${event.navId}`));
    }

    componentWillUnmount() {
        this.appNav();
    }

    render() {
        return (
            <CpCxProvider value={ this.state } >
                <Routes/>
            </CpCxProvider>
        );
    }

}

export default withRouter(App);
