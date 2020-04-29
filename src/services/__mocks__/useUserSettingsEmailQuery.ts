import { UseQueryResponse } from 'react-fetching-library';
import { UserSettings } from '../../types/UserSettings';

const actual = { ...jest.requireActual('../useUserSettingsEmailQuery') };

const useUserSettingsEmailQuery: () => UseQueryResponse<UserSettings> = () => ({
    loading: false,
    abort: jest.fn(),
    query: jest.fn(),
    reset: jest.fn(),
    payload: {
        immediateEmail: true,
        dailyEmail: true
    },
    error: false,
    status: 200
});

actual.useUserSettingsEmailQuery = jest.fn(useUserSettingsEmailQuery);

module.exports = actual;
