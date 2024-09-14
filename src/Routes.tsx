import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ErrorPage } from './pages/Error/Page';
import ListPage from './pages/ListPage/ListPage';
import { PolicyDetail } from './pages/PolicyDetail/PolicyDetail';

// TODO: Unify with Routes when updated to FEC v4 and using InsightsLinks
export const linkTo = {
    listPage: () => '/insights/policies/policies/list',
    policyDetail: (policyId: string) => `/insights/policies/policies/policy/${policyId}`
};

type InsightsElementProps = {
    component: React.ComponentType;
};

const InsightsElement: React.FunctionComponent<InsightsElementProps> = ({ component: PathRouteComponent }) => (
    <ErrorPage>
        <PathRouteComponent />
    </ErrorPage>
);

export const PoliciesRoutes: React.FunctionComponent<unknown> = () => (
    <Routes>
        <Route
            path={ 'policies/list' }
            element={ <InsightsElement component={ ListPage } /> }
        />
        <Route
            path={ 'policies/policy/:policyId' }
            element={ <InsightsElement component={ PolicyDetail } /> }
        />
        <Route path="*" element={ <Navigate to={ 'policies/list' } /> } />
    </Routes>
);
