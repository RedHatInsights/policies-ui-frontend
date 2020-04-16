import { useHistory, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type SetStateAction<T> = T | ((prev: T) => T);
export type Dispatch<T> = (newValueOrFunction: SetStateAction<T>) => void
export type UseUrlStateResponse<T> = [ T | undefined, Dispatch<SetStateAction<T>> ];

type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string) => T;

export const useUrlState =
    <T>(name: string, serializer: Serializer<T>, deserializer: Deserializer<T>, defaultValue?: T): UseUrlStateResponse<T> => {
        const history = useHistory();
        const location = useLocation();

        const value: T | undefined = useMemo(() => {
            const params = new URLSearchParams(location.search);
            const urlValue = params.get(name);
            return urlValue ? deserializer(urlValue) : defaultValue;
        }, [ name, defaultValue, location, deserializer ]);

        const setValue = useCallback(newValueOrFunction => {
            let newValue;
            if (typeof newValueOrFunction === 'function') {
                newValue = newValueOrFunction(value);
            } else {
                newValue = newValueOrFunction;
            }

            const search = new URLSearchParams(location.search);
            if (newValue) {
                search.set(name, serializer(newValue));
            } else {
                search.delete(name);
            }

            history.replace({
                ...location,
                search: search.toString()
            });
        }, [ history, location, name, serializer, value ]);

        return [ value, setValue ];
    };

const identityString = (value: string) => value;

export const useUrlStateString = (name: string, defaultValue?: string) => useUrlState<string>(name, identityString, identityString, defaultValue);
