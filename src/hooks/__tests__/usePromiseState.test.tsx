import { renderHook, act } from '@testing-library/react-hooks';
import { usePromiseState } from '../usePromiseState';
import { waitForAsyncEventsHooks } from '../../../test/TestUtils';

describe('src/hooks/usePromiseState', () => {
    it('Sets value when the promise resolves with the value returned by it', async () => {
        const promise = new Promise<string>((resolve) => {
            resolve('hello world');
        });

        const { result } = renderHook(() => usePromiseState(promise));
        await waitForAsyncEventsHooks();

        expect(result.current).toEqual('hello world');
    });

    it('Value is undefined until the promise resolves', async () => {
        jest.useFakeTimers();
        const promise = new Promise<string>((resolve) => {
            setTimeout(() => resolve('hello world'), 100);
        });

        const { result } = renderHook(() => usePromiseState(promise));
        await waitForAsyncEventsHooks();
        expect(result.current).toEqual(undefined);

        await act(async () => {
            jest.advanceTimersByTime(100);
        });

        expect(result.current).toEqual('hello world');
    });

    it('Value is never set if the hook us unmounted', async () => {
        jest.useFakeTimers();
        const promise = new Promise<string>((resolve) => {
            setTimeout(() => resolve('hello world'), 100);
        });

        const { result, unmount } = renderHook(() => usePromiseState(promise));
        await waitForAsyncEventsHooks();
        expect(result.current).toEqual(undefined);

        await act(async () => {
            unmount();
            jest.advanceTimersByTime(100);
        });

        expect(result.current).toEqual(undefined);
    });
});
