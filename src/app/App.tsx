import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Routes } from '../Routes';

declare var insights: any;

class App extends React.PureComponent<RouteComponentProps> {

    appNav: any;

    componentDidMount() {
        insights.chrome.init();
        insights.chrome.identifyApp('insights');
        this.appNav = insights.chrome.on('APP_NAVIGATION', (event: any) => this.props.history.push(`/${event.navId}`));
        console.log(this.appNav);
    }

    componentWillUnmount() {
        this.appNav();
    }

    render() {
        return (
            <Routes/>
        );
    }

}

export default withRouter(App);
