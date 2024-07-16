import { getBaseName, getInsights } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useEffect } from 'react';
import { matchPath, Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { ErrorPage } from './pages/Error/Page';
import ListPage from './pages/ListPage/ListPage';
import { PolicyDetail } from './pages/PolicyDetail/PolicyDetail';

interface Path {
    path: string;
    component: React.ComponentType;
}

export const linkTo = {
    listPage: () => '/policies/list',
    policyDetail: (policyId: string) => `/policies/policy/${policyId}`
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

type InsightsElementProps = {
    component: React.ComponentType;
};

const InsightsElement: React.FunctionComponent<InsightsElementProps> = ({ component: PathRouteComponent }) => {
    return (
        <ErrorPage>
            <PathRouteComponent />
        </ErrorPage>
    );
};

const relativePath = (base: string, pathname: string) => {
    const relative = pathname.substr(base.length).trim();
    if (relative.length === 0) {
        return linkTo.listPage();
    }

    return relative;
};

export const Routes: React.FunctionComponent<unknown> = () => {
    const insights = getInsights();
    const history = useHistory();

    useEffect(() => {
        const on = insights.chrome.on;
        if (on) {
            return on('APP_NAVIGATION', event => {
                const pathname = event.domEvent.href;
                const base = getBaseName(pathname);
                const relative = relativePath(base, pathname);

                for (const route of pathRoutes) {
                    if (matchPath(relative, {
                        path: route.path,
                        exact: true
                    })) {
                        if (history.location.pathname !== relative) {
                            history.push(relative);
                        }

                        break;
                    }
                }

            });
        }
    }, [ insights.chrome.on, history ]);

    return (
        <Switch>
            { pathRoutes.map(({ path, component }) => (
                <Route
                    key={ path }
                    render={ () => <InsightsElement component={ component } /> }
                    path={ path }
                />
            ))}
            <Route render={ () => <Redirect to={ linkTo.listPage() } /> } />
        </Switch>
    );
};
