import { UserSettings } from '../../types/UserSettings';
import { adapter, UserSettingsServerResponse } from '../useUserSettingsEmailQuery';

describe('src/services/useUserSettingsEmailQuery', () => {
    it('adapter transforms server responses', () => {
        const response: UserSettingsServerResponse = {
            daily_email: true,
            instant_email: true
        };

        const expected: UserSettings = {
            dailyEmail: true,
            immediateEmail: true
        };

        expect(adapter(response)).toEqual(expected);
    });

    it('adapter transforms server responses 2', () => {
        const response: UserSettingsServerResponse = {
            daily_email: false,
            instant_email: true
        };

        const expected: UserSettings = {
            dailyEmail: false,
            immediateEmail: true
        };

        expect(adapter(response)).toEqual(expected);
    });

});
