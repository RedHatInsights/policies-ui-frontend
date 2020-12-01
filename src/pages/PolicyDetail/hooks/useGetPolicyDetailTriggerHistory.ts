import { useCallback, useState } from 'react';

import {
    useGetPolicyTriggersParametrizedQuery,
    useHasPolicyTriggersParametrizedQuery
} from '../../../services/useGetPolicyTriggers';

export interface UseGetListPagePoliciesResponse extends ReturnType<typeof useGetPolicyTriggersParametrizedQuery> {
    hasTriggers: boolean | undefined;
}

export const useGetPolicyDetailTriggerHistory = (): UseGetListPagePoliciesResponse => {
    const getPoliciesQuery = useGetPolicyTriggersParametrizedQuery();
    const hasPoliciesParametrizedQuery = useHasPolicyTriggersParametrizedQuery();
    const [ hasTriggers, setHasTriggers ] = useState<boolean>();

    const query = useCallback((...params: Parameters<ReturnType<typeof useGetPolicyTriggersParametrizedQuery>['query']>) => {
        const [{ policyId, page }] = params;
        const localQuery = getPoliciesQuery.query;
        const hasPoliciesQuery = hasPoliciesParametrizedQuery.query;

        const noFiltersAndFirstPage = !page.hasFilter() && page.index === 1;

        return localQuery({
            policyId,
            page
        }).then(response => {
            if (response.status === 404) {
                if (noFiltersAndFirstPage) {
                    setHasTriggers(false);
                } else {
                    setHasTriggers(undefined);
                    return hasPoliciesQuery(policyId).then(r => {
                        if (r.status === 404) {
                            setHasTriggers(false);
                        } else if (r.status === 200) {
                            setHasTriggers(true);
                        } else {
                            setHasTriggers(undefined);
                        }

                        return response;
                    });
                }
            } else if (response.status === 200) {
                setHasTriggers(true);
            } else {
                setHasTriggers(undefined);
            }

            return response;
        });
    }, [ getPoliciesQuery.query, hasPoliciesParametrizedQuery.query ]);

    const abort = useCallback(() => {
        const abortPolicyQuery = getPoliciesQuery.abort;
        const abortHasPolicies = hasPoliciesParametrizedQuery.abort;

        abortPolicyQuery();
        abortHasPolicies();
    }, [ getPoliciesQuery.abort, hasPoliciesParametrizedQuery.abort ]);

    const reset = useCallback(() => {
        const resetPolicyQuery = getPoliciesQuery.reset;
        const resetHasPolicies = hasPoliciesParametrizedQuery.reset;

        resetPolicyQuery();
        resetHasPolicies();
    }, [ getPoliciesQuery.reset, hasPoliciesParametrizedQuery.reset ]);

    return {
        ...getPoliciesQuery,
        query,
        abort,
        reset,
        status: getPoliciesQuery.status,
        loading: hasPoliciesParametrizedQuery.loading || getPoliciesQuery.loading,
        errorObject: hasPoliciesParametrizedQuery.errorObject || getPoliciesQuery.errorObject,
        error: hasPoliciesParametrizedQuery.error || getPoliciesQuery.error,
        hasTriggers
    };
};
