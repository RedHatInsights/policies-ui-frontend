import { useGetPoliciesQuery, useHasPoliciesQuery } from '../../services/useGetPolicies';
import { Page } from '../../types/Page';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UseGetListPagePoliciesResponse extends ReturnType<typeof useGetPoliciesQuery> {
    hasPolicies: boolean | undefined;
}

export const useGetListPagePolicies = (page: Page): UseGetListPagePoliciesResponse => {
    const getPoliciesQuery = useGetPoliciesQuery(page, false);
    const hasPoliciesParametrizedQuery = useHasPoliciesQuery();
    const [ hasPolicies, setHasPolicies ] = useState<boolean>();

    useEffect(() => {
        if (getPoliciesQuery.status === 200) {
            setHasPolicies(true);
        } else if (getPoliciesQuery.status === 404) {
            setHasPolicies(false);
        }
    }, [ getPoliciesQuery.status ]);

    const noFiltersAndFirstPage: boolean = useMemo(() => {
        return !page.hasFilter() && page.index === 1;
    }, [ page ]);

    const query = useCallback(() => {
        const localQuery = getPoliciesQuery.query;
        const hasPoliciesQuery = hasPoliciesParametrizedQuery.query;

        if (noFiltersAndFirstPage) {
            return localQuery();
        } else {
            return localQuery().then(response => {
                if (response.status === 404) {
                    setHasPolicies(undefined);
                    hasPoliciesQuery().then(r => {
                        if (r.status === 404) {
                            setHasPolicies(false);
                        } else if (r.status === 200) {
                            setHasPolicies(true);
                        }

                        return response;
                    });
                }

                return response;
            });
        }
    }, [ getPoliciesQuery.query, hasPoliciesParametrizedQuery.query, noFiltersAndFirstPage ]);

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
        hasPolicies
    };
};
