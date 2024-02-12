import { getBaseName, getInsights } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useEffect } from 'react';
import { matchPath, Redirect } from 'react-router';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom-v5-compat';

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

export const InsightsRoutes: React.FunctionComponent<unknown> = () => {
    const insights = getInsights();
    const navigate = useNavigate();
    const location = useLocation();

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
                        if (location.pathname !== relative) {
                            navigate(relative);
                        }

                        break;
                    }
                }
            });
        }
    }, [ insights.chrome.on, location, navigate ]);

    return (
        <Routes>
            { pathRoutes.map(({ path, component }) => (
                <Route
                    key={ path }
                    element={ <InsightsElement component={ component } /> }
                    path={ path }
                />
            ))}
            <Route element={ <Redirect to={ linkTo.listPage() } /> } />
        </Routes>
    );
};
