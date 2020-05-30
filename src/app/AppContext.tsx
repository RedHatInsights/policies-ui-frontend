import * as React from 'react';
import { Rbac } from '../types/Rbac';
import { UserSettings } from '../types/UserSettings';

export interface AppContext {
    rbac: Rbac;
    userSettings: UserSettingsAppContext;
}

export interface UserSettingsAppContext {
    settings?: UserSettings;
    isSubscribedForNotifications: boolean;
    refresh: () => void;
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadAll: false,
        canWriteAll: false
    },
    userSettings: {
        settings: undefined,
        isSubscribedForNotifications: false,
        refresh: () => {}
    }
});
