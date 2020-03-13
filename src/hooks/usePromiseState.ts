import * as React from 'react';
import { usePromise } from 'react-use';

type UseResolvedPromiseValueReturn<T> = T | undefined;

export const usePromiseState = <T>(promise: Promise<T>): UseResolvedPromiseValueReturn<T> => {
    const [ value, setValue ] = React.useState<T>();
    const mounted = usePromise();

    React.useEffect(() => {
        mounted(promise).then(setValue);
    }, [ promise, mounted ]);

    return value;
};
