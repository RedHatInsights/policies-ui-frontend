import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { actionBuilder } from 'openapi2typescript/react-fetching-library';
import { useQuery } from 'react-fetching-library';

import Config from '../config/Config';
import { UserSettings } from '../types/UserSettings';

const urls = Config.apis.urls;

export type UserSettingsServerResponse = {
    daily_email: boolean;
    instant_email: boolean;
};

export const adapter = (response: UserSettingsServerResponse): UserSettings => {
    return {
        dailyEmail: response.daily_email,
        immediateEmail: response.instant_email
    };
};

export const useUserSettingsEmailQuery = (initFetch?: boolean) => {
    return useTransformQueryResponse(
        useQuery<UserSettingsServerResponse>(actionBuilder('GET', urls.userSettings.email).build(), initFetch),
        adapter
    );
};
