import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import { Routes } from '../Routes';
import { AppSkeleton } from '../components/AppSkeleton/AppSkeleton';

import '@redhat-cloud-services/frontend-components/index.css';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { AppContext } from './AppContext';
import { NoPermissionsPage } from '../pages/NoPermissions/NoPermissionsPage';
import { useApp } from './useApp';

import './App.scss';

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
