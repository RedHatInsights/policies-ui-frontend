import * as React from 'react';
import { RouteProps, Route, Switch, Redirect } from 'react-router';

import { ErrorPage } from './pages/Error/Page';
import ListPage from './pages/ListPage/ListPage';
import { PolicyDetail } from './pages/PolicyDetail/PolicyDetail';

interface Path {
    path: string;
    component: React.ComponentType;
    rootClass: string;
}

export const linkTo = {
    listPage: () => '/list',
    policyDetail: (policyId: string) => `/policy/${policyId}`
};

const pathRoutes: Path[] = [
    {
        path: linkTo.listPage(),
        component: ListPage,
        rootClass: 'list'
    },
    {
        path: linkTo.policyDetail(':policyId'),
        component: PolicyDetail,
        rootClass: 'policy'
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

    return (
        <ErrorPage>
            <Route { ...rest }/>
        </ErrorPage>
    );
};

type RoutesProps = {};

export const Routes: React.FunctionComponent<RoutesProps> = () => {
    return (
        <Switch>
            { pathRoutes.map(pathRoute => (
                <InsightsRoute
                    key={ pathRoute.path }
                    rootClass={ pathRoute.rootClass }
                    component={ pathRoute.component }
                    path={ pathRoute.path }
                />
            ))}
            <Redirect to={ linkTo.listPage() }/>
        </Switch>
    );
};
