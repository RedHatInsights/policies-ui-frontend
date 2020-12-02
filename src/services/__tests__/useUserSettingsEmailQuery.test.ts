import { UserSettings } from '../../types/UserSettings';
import { adapter, UserSettingsServerResponse } from '../useUserSettingsEmailQuery';

describe('src/services/useUserSettingsEmailQuery', () => {
    it('adapter transforms server responses', () => {
        const response: UserSettingsServerResponse = [
            {
                fields: [
                    {
                        name: 'dailyEmail',
                        label: 'some label',
                        initialValue: true,
                        component: 'checkbox',
                        validate: []
                    },
                    {
                        name: 'immediateEmail',
                        label: 'other label',
                        initialValue: true,
                        component: 'checkbox',
                        validate: []
                    }
                ]
            }
        ];

        const expected: UserSettings = {
            dailyEmail: true,
            immediateEmail: true
        };

        expect(adapter(response)).toEqual(expected);
    });

    it('adapter transforms server responses 2', () => {
        const response: UserSettingsServerResponse = [
            {
                fields: [
                    {
                        name: 'dailyEmail',
                        label: 'some label',
                        initialValue: false,
                        component: 'checkbox',
                        validate: []
                    },
                    {
                        name: 'immediateEmail',
                        label: 'other label',
                        initialValue: true,
                        component: 'checkbox',
                        validate: []
                    }
                ]
            }
        ];

        const expected: UserSettings = {
            dailyEmail: false,
            immediateEmail: true
        };

        expect(adapter(response)).toEqual(expected);
    });

    it('empty response is all false', () => {
        const response: UserSettingsServerResponse = [];

        const expected: UserSettings = {
            dailyEmail: false,
            immediateEmail: false
        };

        expect(adapter(response)).toEqual(expected);
    });

});
