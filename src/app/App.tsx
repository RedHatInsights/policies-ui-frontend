import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import './App.scss';

import { Routes } from '../Routes';
import { AppSkeleton } from '../components/AppSkeleton/AppSkeleton';

import { AppContext } from './AppContext';
import { NoPermissionsPage } from '../pages/NoPermissions/NoPermissionsPage';
import { useApp } from './useApp';

const App: React.FunctionComponent<RouteComponentProps> = () => {

    const { rbac, userSettings } = useApp();

    if (!rbac) {
        return (
            <AppSkeleton/>
        );
    }

    return (
        <AppContext.Provider value={ {
            rbac,
            userSettings
        } }>
            { rbac.canReadAll ? (
                <>
                    <NotificationsPortal/>
                    <Routes/>
                </>
            ) : (
                <NoPermissionsPage/>
            ) }
        </AppContext.Provider>
    );
};

export default withRouter(App);
