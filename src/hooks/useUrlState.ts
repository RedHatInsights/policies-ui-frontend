import { useHistory, useLocation } from 'react-router-dom';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

export type UseUrlStateResponse<T> = [ T | undefined, Dispatch<SetStateAction<T>> ];

type Serializer<T> = (value: T) => string | undefined;
type Deserializer<T> = (value: string) => T | undefined;

export const useUrlState =
    <T>(name: string, serializer: Serializer<T>, deserializer: Deserializer<T>, initialValue?: T): UseUrlStateResponse<T> => {
        const history = useHistory();
        const location = useLocation();

        const memoizedInitialValue = useMemo(
            () => initialValue,
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        );

        const value: T | undefined = useMemo(() => {
            console.log('Fetching value from url:', name);
            const params = new URLSearchParams(location.search);
            const urlValue = params.get(name);
            return (urlValue !== undefined && urlValue !== null) ? deserializer(urlValue) : memoizedInitialValue;
        }, [ name, memoizedInitialValue, location, deserializer ]);

        const setValue = useCallback(newValueOrFunction => {
            console.log('Request to set value to url:', name);
            let newValue;
            if (typeof newValueOrFunction === 'function') {
                newValue = newValueOrFunction(value);
            } else {
                newValue = newValueOrFunction;
            }

            console.log('newValue', newValue, 'value', value);
            if (newValue !== value) {
                const serializedNewValue = newValue === undefined ? undefined : serializer(newValue);
                console.log('serializedNewValue', serializedNewValue);
                const search = new URLSearchParams(location.search);
                if (serializedNewValue === undefined) {
                    search.delete(name);
                } else {
                    search.set(name, serializedNewValue);
                }

                const searchString = '?' + search.toString();
                console.log('searchString', searchString, 'location.search', location.search);
                if (searchString !== location.search) {
                    console.log('Setting value to url:', name);
                    history.replace({
                        ...location,
                        search: searchString
                    });
                }
            }
        }, [ history, location, name, serializer, value ]);

        return [ value, setValue ];
    };

const serializer = (value: string) => value === '' ? undefined : value;
const deserializer = (value: string) => value;

export const useUrlStateString = (name: string, initialValue?: string) => useUrlState<string>(name, serializer, deserializer, initialValue);
