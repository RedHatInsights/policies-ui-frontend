import * as React from 'react';
import { Rbac } from '../types/Rbac';
import { UserSettings } from '../types/UserSettings';

interface AppContext {
    rbac: Rbac;
    userSettings?: UserSettings & {
        refresh: () => void;
    };
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadAll: false,
        canWriteAll: false
    },
    userSettings: undefined
});
