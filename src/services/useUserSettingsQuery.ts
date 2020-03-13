import { useNewQuery } from './Api';
import Config from '../config/Config';
import { UserSettings } from '../types/UserSettings';
import { useTransformQueryResponse } from '../utils/ApiUtils';

const urls = Config.apis.urls;

type UserSettingsServerResponse = {
    fields: {
        name: string;
        label: string;
        initialValue: boolean;
        component: string;
        validate: [];
    }[];
}[];

const adapter = (response: UserSettingsServerResponse): UserSettings => {
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

export const useUserSettingsQuery = (initFetch?: boolean) => {
    return useTransformQueryResponse(
        useNewQuery<UserSettingsServerResponse>('GET', urls.settings, initFetch),
        adapter
    );
};
