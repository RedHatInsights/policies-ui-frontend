import * as React from 'react';
import { Redirect, Route, RouteProps, Switch } from 'react-router';

import { ErrorPage } from './pages/Error/Page';
import ListPage from './pages/ListPage/ListPage';
import { PolicyDetail } from './pages/PolicyDetail/PolicyDetail';

interface Path {
    path: string;
    component: React.ComponentType;
}

export const linkTo = {
    listPage: () => '/list',
    policyDetail: (policyId: string) => `/policy/${policyId}`
};

const pathRoutes: Path[] = [
    {
        path: linkTo.listPage(),
        component: ListPage
    },
    {
        path: linkTo.policyDetail(':policyId'),
        component: PolicyDetail
    }
];

type InsightsRouteProps = RouteProps;

const InsightsRoute: React.FunctionComponent<InsightsRouteProps> = (props: InsightsRouteProps) => {
    return (
        <ErrorPage>
            <Route { ...props } />
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
                    component={ pathRoute.component }
                    path={ pathRoute.path }
                />
            ))}
            <Redirect to={ linkTo.listPage() } />
        </Switch>
    );
};
