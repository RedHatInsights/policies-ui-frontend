import { useDebounce } from 'react-use';
import { Dispatch, SetStateAction, useState, useCallback } from 'react';

type UseStateType = typeof useState;
type UseDebouncedStateReturn<T> = [ T, Dispatch<SetStateAction<T>>, T, () => boolean | null ];

export const useDebouncedState = <T>(initialValue: T, ms: number, useStateHook?: UseStateType): UseDebouncedStateReturn<T> => {
    if (!useStateHook) {
        useStateHook = useState;
    }

    const [ debouncedState, setDebouncedState ] = useStateHook<T>(initialValue);
    const [ state, setState ] = useState<T>(debouncedState);

    const debounceCallback = useCallback(() => {
        if (state !== debouncedState) {
            console.log('debouncing', state);
            setDebouncedState(state);
        }
    }, [ state, setDebouncedState, debouncedState ]);

    const [ isReady ] = useDebounce(debounceCallback, ms, [ debounceCallback ]);

    return [
        state, setState, debouncedState, isReady
    ];
};
