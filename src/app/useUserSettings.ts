import { useSyncInterval } from '@redhat-cloud-services/insights-common-typescript';
import { useCallback, useMemo } from 'react';

import { useUserSettingsEmailQuery } from '../services/useUserSettingsEmailQuery';
import { UserSettingsAppContext } from './AppContext';

export const useUserSettings = (refreshEveryMs: number): UserSettingsAppContext => {
    const userSettingsEmailQuery = useUserSettingsEmailQuery();
    const refresh = userSettingsEmailQuery.query as () => void;

    useSyncInterval(refreshEveryMs, useCallback(() => {
        refresh();
    }, [ refresh ]));

    const userSettings = useMemo(() => {
        let isSubscribedForNotifications = false;
        const settings = userSettingsEmailQuery.payload;
        if (settings) {
            isSubscribedForNotifications = !!settings.dailyEmail || !!settings.immediateEmail;
        }

        return {
            settings: userSettingsEmailQuery.payload,
            refresh,
            isSubscribedForNotifications
        };
    }, [ userSettingsEmailQuery.payload, refresh ]);

    return userSettings;
};
