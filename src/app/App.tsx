import './App.scss';

// import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { AppSkeleton } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

// import { InsightsRoutes } from '../InsightsRoutes';
// import { NoPermissionsPage } from '../pages/NoPermissions/NoPermissionsPage';
// import { AppContext } from './AppContext';
import { useApp } from './useApp';

const App: React.FunctionComponent = () => {

    const { rbac, userSettings } = useApp();

    if (!rbac) {
        return (
            <AppSkeleton />
        );
    }

    return (
        <div />
    // <AppContext.Provider value={ {
    //     rbac,
    //     userSettings
    // } }>
    //     { rbac.canReadPolicies ? (
    //         <>
    //             <NotificationsPortal />
    //             <InsightsRoutes />
    //         </>
    //     ) : (
    //         <NoPermissionsPage />
    //     ) }
    // </AppContext.Provider>
);
};

export default App;
