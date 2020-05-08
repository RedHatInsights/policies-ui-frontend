import { useDebounce, useUpdateEffect } from 'react-use';
import { Dispatch, SetStateAction, useState, useCallback } from 'react';

type UseStateType = typeof useState;
type UseDebouncedStateReturn<T> = [ T, Dispatch<SetStateAction<T>>, T, () => boolean | null ];

export type UseDebouncedStateType<T> = (initialValue: T, ms: number, useStateHook?: UseStateType) => UseDebouncedStateReturn<T>;

export const useDebouncedState = <T>(initialValue: T, ms: number, useStateHook?: UseStateType): UseDebouncedStateReturn<T> => {
    if (!useStateHook) {
        useStateHook = useState;
    }

    const [ debouncedState, setDebouncedState ] = useStateHook<T>(initialValue);
    const [ state, setState ] = useState<T>(debouncedState);

    const debounceCallback = useCallback(() => {
        if (state !== debouncedState) {
            setDebouncedState(state);
        }
    }, [ state, setDebouncedState, debouncedState ]);

    useUpdateEffect(() => {
        setState(debouncedState);
    }, [ debouncedState ]);

    const [ isReady ] = useDebounce(debounceCallback, ms, [ state ]);

    return [
        state, setState, debouncedState, isReady
    ];
};
