import * as React from 'react';
import { useDebounce } from 'react-use';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

type UseDebouncedStateReturn<T> = [ T, Dispatch<SetStateAction<T>>, T, () => boolean | null ];

export const useDebouncedState = <T>(defaultValue: T, ms: number): UseDebouncedStateReturn<T> => {
    const [ state, setState ] = React.useState<T>(defaultValue);
    const [ debouncedState, setDebouncedState ] = React.useState<T>(defaultValue);

    const debounceCallback = React.useCallback(() => {
        setDebouncedState(state);
    }, [ state, setDebouncedState ]);

    const [ isReady ] = useDebounce(debounceCallback, ms, [ debounceCallback ]);

    return [
        state, setState, debouncedState, isReady
    ];
};
