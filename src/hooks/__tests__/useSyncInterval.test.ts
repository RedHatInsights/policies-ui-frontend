import { renderHook, act } from '@testing-library/react-hooks';
import { useSyncInterval } from '../useSyncInterval';

describe('src/hooks/useSyncInterval', () => {
    it('Calls function after 500ms', () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        renderHook(() => {
            return useSyncInterval(500, fn);
        });

        expect(fn).toHaveBeenCalledTimes(0);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(fn).toHaveBeenCalledTimes(0);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('Calls function immediately if set to true', () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        renderHook(() => {
            return useSyncInterval(500, fn, true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('Calls function immediately if set to true and again every time 500 ms', () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        renderHook(() => {
            return useSyncInterval(500, fn, true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(fn).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(fn).toHaveBeenCalledTimes(2);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(fn).toHaveBeenCalledTimes(3);
    });

    it('Accepts async functions', () => {
        jest.useFakeTimers();
        const fn = jest.fn(async () => {
            return jest.fn();
        });

        renderHook(() => {
            useSyncInterval(500, fn, true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('Calls again if rendering with different ms', () => {
        jest.useFakeTimers();
        const fn = jest.fn(async () => {
            return jest.fn();
        });

        let ms = 500;

        const controls = renderHook(() => {
            return useSyncInterval(ms, fn, true);
        });

        expect(fn).toHaveBeenCalledTimes(1);

        ms = 700;
        controls.rerender();

        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('Does not schedule function again until the callback has finished (async)', async () => {
        jest.useFakeTimers();
        let resolve;
        const promise = new Promise(resolver => {
            resolve = resolver;
        });

        const fn = jest.fn(() => promise);

        renderHook(() => {
            return useSyncInterval(500, fn, true);
        });

        expect(fn).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(fn).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(fn).toHaveBeenCalledTimes(1);

        await resolve();
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
