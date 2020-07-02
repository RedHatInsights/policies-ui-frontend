import Config from '../config/Config';
import { UserSettings } from '../types/UserSettings';
import { useQuery } from 'react-fetching-library';
import { actionBuilder, useTransformQueryResponse } from 'common-code-ui';

const urls = Config.apis.urls;

export type UserSettingsServerResponse = {
    fields: {
        name: string;
        label: string;
        initialValue: boolean;
        component: string;
        validate: [];
    }[];
}[];

export const adapter = (response: UserSettingsServerResponse): UserSettings => {
    const userSettings: UserSettings = {
        dailyEmail: false,
        immediateEmail: false
    };
    response.forEach(group => group.fields.forEach(field => {
        if (field.name === 'dailyEmail') {
            userSettings.dailyEmail = field.initialValue;
        } else if (field.name === 'immediateEmail') {
            userSettings.immediateEmail = field.initialValue;
        }
    }));
    return  userSettings;
};

export const useUserSettingsEmailQuery = (initFetch?: boolean) => {
    return useTransformQueryResponse(
        useQuery<UserSettingsServerResponse>(actionBuilder('GET', urls.userSettings.email).build(), initFetch),
        adapter
    );
};
