import * as React from 'react';

import { UserSettings } from '../types/UserSettings';

export interface AppContext {
    rbac: {
        canReadPolicies: boolean;
        canWritePolicies: boolean;
    };
    userSettings: UserSettingsAppContext;
}

export interface UserSettingsAppContext {
    settings?: UserSettings;
    isSubscribedForNotifications: boolean;
    refresh: () => void;
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadPolicies: false,
        canWritePolicies: false
    },
    userSettings: {
        settings: undefined,
        isSubscribedForNotifications: false,
        refresh: () => {
            console.error('Using default refresh function');
        }
    }
});
