import { renderHook, act } from '@testing-library/react-hooks';
import { useDebouncedState, UseDebouncedStateType } from '../useDebouncedState';
import { useEffect, useState } from 'react';

type P<T> = Parameters<UseDebouncedStateType<T>>;

const renderHookUseDebouncedState = <T>(...initialValue: P<T>) => renderHook(
    (args: P<T>) => useDebouncedState<T>(...args),
    {
        initialProps: initialValue
    }
);

describe('src/hooks/useDebouncedState', () => {
    test('should have initial value', () => {
        const { result } = renderHookUseDebouncedState<string>('my value', 200);
        const [ state ] = result.current;

        expect(state).toEqual('my value');
    });

    test('initialValue is not mutable', () => {
        const { result, rerender } = renderHookUseDebouncedState<string>('my value', 200);
        {
            const [ state ] = result.current;
            expect(state).toEqual('my value');
        }

        rerender([ 'other value', 200 ]);

        {
            const [ state ] = result.current;
            expect(state).toEqual('my value');
        }
    });

    test('should update state immediately', () => {
        const { result } = renderHookUseDebouncedState<string>('my value', 200);
        act(() => {
            const [ , setState ] = result.current;
            setState('hello world');
        });
        {
            const [ state ] = result.current;
            expect(state).toEqual('hello world');
        }
    });

    test('update on value changes (depending internal state of the useStateHook)', () => {
        jest.useFakeTimers();

        const useInternalValueChanger = (...initValue: Parameters<typeof useState>) => {
            const [ value, setValue ] = useState<string>(...initValue);
            useEffect(() => {
                setTimeout(() => {
                    setValue(v => v + '1');
                }, 1000);
            }, []);
            return [ value, setValue ] as ReturnType<typeof useState>;
        };

        const { result } = renderHookUseDebouncedState<string>('my value', 200, useInternalValueChanger);
        act(() => {
            const [ , setState ] = result.current;
            setState('hello world');
        });
        act(() => {
            jest.advanceTimersByTime(300);
        });
        {
            const [ state ] = result.current;
            expect(state).toEqual('hello world');
        }

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        {
            const [ state,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('hello world1');
            expect(state).toEqual('hello world1');
        }
    });

    test('should update debounced state after ms', () => {
        jest.useFakeTimers();
        const { result } = renderHookUseDebouncedState<string>('my value', 200);
        act(() => {
            const [ , setState ] = result.current;
            setState('hello world');
        });
        {
            const [ ,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('my value');
        }

        act(() => {
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('my value');
        }

        act(() => {
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('hello world');
        }
    });

    test('should update debounced state after ms after last state change', () => {
        jest.useFakeTimers();
        const { result } = renderHookUseDebouncedState<string>('my value', 200);
        act(() => {
            const [ , setState ] = result.current;
            setState('hello world');
        });
        {
            const [ ,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('my value');
        }

        act(() => {
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('my value');
        }

        act(() => {
            const [ , setState ] = result.current;
            setState('other update');
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('my value');
        }

        act(() => {
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,, debouncedState ] = result.current;
            expect(debouncedState).toEqual('other update');
        }
    });

    test('isReady should be false prior to update and true when updated', () => {
        jest.useFakeTimers();
        const { result } = renderHookUseDebouncedState<string>('my value', 200);
        {
            const [ ,,, isReady ] = result.current;
            expect(isReady()).toEqual(false);
        }

        act(() => {
            const [ , setState ] = result.current;
            setState('hello world');
        });
        {
            const [ ,,, isReady ] = result.current;
            expect(isReady()).toEqual(false);
        }

        act(() => {
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,,, isReady ] = result.current;
            expect(isReady()).toEqual(false);
        }

        act(() => {
            const [ , setState ] = result.current;
            setState('other update');
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,,, isReady ] = result.current;
            expect(isReady()).toEqual(false);
        }

        act(() => {
            jest.advanceTimersByTime(150);
        });

        {
            const [ ,,, isReady ] = result.current;
            expect(isReady()).toEqual(true);
        }
    });
});
