import * as React from 'react';
import { Rbac } from '../types/Rbac';
import { UserSettings } from '../types/UserSettings';
import { Insights } from '../types/Insights';

export interface AppContext {
    rbac: Rbac;
    userSettings: UserSettingsAppContext;
    insights: Insights;
}

export interface UserSettingsAppContext {
    settings?: UserSettings;
    isSubscribedForNotifications: boolean;
    refresh: () => void;
}

const throwException: (...args: any) => any = () => {
    throw new Error('Invalid usage of default context');
};

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadAll: false,
        canWriteAll: false
    },
    userSettings: {
        settings: undefined,
        isSubscribedForNotifications: false,
        refresh: () => throwException
    },
    insights: {
        chrome: {
            auth: {
                getUser: throwException
            },
            identifyApp: throwException,
            init: throwException,
            isBeta: throwException,
            isProd: false,
            on: throwException
        }
    }
});
