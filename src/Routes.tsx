import * as React from 'react';
import { RouteProps, Route, Switch, Redirect } from 'react-router';

import ListPage from './pages/ListPage/ListPage';
import { AddCustomPolicyPage } from './pages/AddCustomPolicyPage';

interface Path {
    path: string;
    component: React.ComponentType;
    rootClass: string;
}

const pathRoutes: Path[] = [
    {
        path: '/list',
        component: ListPage,
        rootClass: 'list'
    },
    {
        path: '/add',
        component: AddCustomPolicyPage,
        rootClass: 'add-custom-policies'
    }
];

type InsightsRouteProps = {
    rootClass: string;
} & RouteProps;

const InsightsRoute: React.FunctionComponent<InsightsRouteProps> = (props: InsightsRouteProps) => {
    const { rootClass, ...rest } = props;
    const root = document.getElementById(('root'));
    if (!root) {
        throw new Error('Root element not found');
    }

    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route { ...rest }/>);
};

interface RoutesProps {}

export const Routes: React.FunctionComponent<RoutesProps> = () => {
    return (
        <Switch>
            { pathRoutes.map(pathRoute => (
                <InsightsRoute key={ pathRoute.path } rootClass={ pathRoute.rootClass } component={ pathRoute.component } path={ pathRoute.path }/>
            )) }
            <Redirect to="/list"/>
        </Switch>
    );
};
