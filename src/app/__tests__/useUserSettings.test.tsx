import { renderHook, act } from '@testing-library/react-hooks';
import { useUserSettings } from '../useUserSettings';
import { useUserSettingsEmailQuery } from '../../services/useUserSettingsEmailQuery';
import { UserSettings } from '../../types/UserSettings';
import { waitForAsyncEventsHooks } from '../../../test/TestUtils';

jest.mock('../../services/useUserSettingsEmailQuery', () => {
    return {
        useUserSettingsEmailQuery: jest.fn(() => ({
            loading: false,
            query: jest.fn()
        }))
    };
});

describe('src/app/useUserSettings', () => {
    it('refresh is called every `refreshEveryMs` ms', async () => {
        jest.useFakeTimers();
        const refresh = jest.fn();
        (useUserSettingsEmailQuery as jest.Mock).mockImplementation(() => ({
            query: refresh,
            payload: undefined
        }));

        renderHook(() => useUserSettings(1000));

        await waitForAsyncEventsHooks();

        expect(refresh).toBeCalledTimes(0);

        await act(async () => {
            await jest.advanceTimersByTime(1200);
        });

        expect(refresh).toBeCalledTimes(1);

        await act(async () => {
            await jest.advanceTimersByTime(1200);
        });

        expect(refresh).toBeCalledTimes(2);
    });

    it('isSubscribedForNotifications is false when useUserSettingsEmailQuery.payload is falsy', async () => {
        jest.useFakeTimers();
        (useUserSettingsEmailQuery as jest.Mock).mockImplementation(() => ({
            query: jest.fn(),
            payload: undefined
        }));

        const { result } = renderHook(() => useUserSettings(1000));

        await waitForAsyncEventsHooks();

        expect(result.current.isSubscribedForNotifications).toBeFalsy();

        await act(async () => {
            await jest.advanceTimersByTime(1200);
        });

        expect(result.current.isSubscribedForNotifications).toBeFalsy();
    });

    it('isSubscribedForNotifications is true when dailyEmail is true or immediateEmail is true', async () => {
        jest.useFakeTimers();
        let payload: UserSettings | undefined = undefined;
        (useUserSettingsEmailQuery as jest.Mock).mockImplementation(() => ({
            query: jest.fn(),
            payload
        }));

        const { result, rerender } = renderHook(() => useUserSettings(1000));

        await waitForAsyncEventsHooks();

        expect(result.current.isSubscribedForNotifications).toBeFalsy();

        payload = {
            dailyEmail: true,
            immediateEmail: false
        };
        await rerender();
        expect(result.current.isSubscribedForNotifications).toBeTruthy();

        payload = {
            dailyEmail: false,
            immediateEmail: true
        };
        await rerender();
        expect(result.current.isSubscribedForNotifications).toBeTruthy();

        payload = {
            dailyEmail: true,
            immediateEmail: true
        };
        await rerender();
        expect(result.current.isSubscribedForNotifications).toBeTruthy();

        payload = {
            dailyEmail: false,
            immediateEmail: false
        };
        await rerender();
        expect(result.current.isSubscribedForNotifications).toBeFalsy();
    });
});
