import './App.scss';

import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { AppSkeleton } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { NoPermissionsPage } from '../pages/NoPermissions/NoPermissionsPage';
import { Routes } from '../Routes';
import { AppContext } from './AppContext';
import { useApp } from './useApp';

const App: React.FunctionComponent<RouteComponentProps> = () => {

    const { rbac, userSettings } = useApp();

    if (!rbac) {
        return (
            <AppSkeleton />
        );
    }

    return (
        <AppContext.Provider value={ {
            rbac,
            userSettings
        } }>
            { rbac.canReadAll ? (
                <>
                    <NotificationsPortal />
                    <Routes />
                </>
            ) : (
                <NoPermissionsPage />
            ) }
        </AppContext.Provider>
    );
};

export default withRouter(App);
