import * as React from 'react';

import { Policy } from '../types/Policy';

export interface UsePolicyToDeleteResponse {
    open: (policyOrCount: Policy | number) => void;
    close: () => void;
    count: number;
    policy?: Policy;
    isOpen: boolean;
}

export const usePolicyToDelete = (): UsePolicyToDeleteResponse => {

    const [ policy, setPolicy ] = React.useState<Policy>();
    const [ count, setCount ] = React.useState<number>(0);

    const close = React.useCallback(() => {
        setPolicy(undefined);
        setCount(0);
    }, [ setCount, setPolicy ]);

    const open = React.useCallback((policyOrCount: Policy | number) => {
        if (typeof policyOrCount === 'number') {
            setPolicy(undefined);
            setCount(policyOrCount);
        } else {
            setPolicy(policyOrCount);
            setCount(1);
        }
    }, []);

    return {
        open,
        close,
        count,
        policy,
        isOpen: count > 0
    };
};
