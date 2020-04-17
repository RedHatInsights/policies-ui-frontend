import { useHistory, useLocation } from 'react-router-dom';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export type UseUrlStateResponse<T> = [ T | undefined, Dispatch<SetStateAction<T | undefined>> ];
export type Serializer<T> = (value: T) => string | undefined;
export type Deserializer<T> = (value: string) => T | undefined;

export type UseUrlStateType<T> = (name: string, serializer: Serializer<T>, deserializer: Deserializer<T>, initialValue?: T) => UseUrlStateResponse<T>;

export const useUrlState =
    <T>(name: string, serializer: Serializer<T>, deserializer: Deserializer<T>, initialValue?: T): UseUrlStateResponse<T> => {
        const history = useHistory();
        const location = useLocation();

        const setUrlValue = useCallback((serializedValue: string | undefined) => {
            const search = new URLSearchParams(location.search);
            if (serializedValue === undefined) {
                search.delete(name);
            } else {
                search.set(name, serializedValue);
            }

            const searchString = '?' + search.toString();
            if (searchString !== location.search) {
                history.replace({
                    ...location,
                    search: searchString
                });
            }
        }, [ location, history, name ]);

        const [ value, localSetValue ] = useState<T | undefined>(() => {
            const params = new URLSearchParams(location.search);
            const urlValue = params.get(name);
            if ((urlValue === undefined || urlValue === null)) {
                if (initialValue) {
                    setUrlValue(serializer(initialValue));
                }

                return initialValue;
            } else {
                return deserializer(urlValue);
            }
        });

        const setValue = useCallback(newValueOrFunction => {
            let newValue;
            if (typeof newValueOrFunction === 'function') {
                newValue = newValueOrFunction(value);
            } else {
                newValue = newValueOrFunction;
            }

            if (newValue !== value) {
                localSetValue(newValue);
                const serializedNewValue = newValue === undefined ? undefined : serializer(newValue);
                setUrlValue(serializedNewValue);
            }
        }, [ serializer, value, setUrlValue ]);

        return [ value, setValue ];
    };

const serializer = (value: string) => value === '' ? undefined : value;
const deserializer = (value: string) => value;

export type UseUrlStateStringType = (name: string, initialValue?: string) => UseUrlStateResponse<string>;
export const useUrlStateString = (name: string, initialValue?: string) => useUrlState<string>(name, serializer, deserializer, initialValue);
