import * as React from 'react';
import { createClient, ClientContextProvider } from 'react-fetching-library';
import { RouteComponentProps, withRouter } from 'react-router';
import { Routes } from '../Routes';

declare const insights: any;

class App extends React.PureComponent<RouteComponentProps> {

    appNav: any;

    componentDidMount() {
        insights.chrome.init();
        insights.chrome.identifyApp('custom-policies');
        this.appNav = insights.chrome.on('APP_NAVIGATION', (event: any) => this.props.history.push(`/${event.navId}`));
    }

    componentWillUnmount() {
        this.appNav();
    }

    render() {

        const client = createClient();

        return (
            <ClientContextProvider client={ client }>
                <Routes/>
            </ClientContextProvider>
        );
    }

}

export default withRouter(App);
