import * as React from 'react';
import { NewPolicy, Policy } from '../../../../types/Policy/Policy';
import { usePolicyFilter, usePolicyPage, usePolicyRows } from '../../../../hooks';
import { useSort } from '@redhat-cloud-services/insights-common-typescript';
import { useGetPoliciesQuery } from '../../../../services/useGetPolicies';
import { useUpdateEffect } from 'react-use';
import { CreatePolicyStepContext } from './Context';

export const defaultPerPage = 5;

export interface CreatePolicyStepContextProps {
    showCreateStep: boolean;
}

export const CreatePolicyStepContextProvider: React.FunctionComponent<CreatePolicyStepContextProps> = (props) => {
    const [ copyPolicy, setCopyPolicy ] = React.useState<boolean>(false);
    const [ copiedPolicy, setCopiedPolicy ] = React.useState<NewPolicy | undefined>({} as NewPolicy);
    const policyFilter = usePolicyFilter(undefined, false);
    const policySort = useSort();
    const policyPage = usePolicyPage(policyFilter.debouncedFilters, defaultPerPage, policySort.sortBy);
    const policyQuery = useGetPoliciesQuery(policyPage.page, false);

    let policiesOrUndefined: Array<Policy> | undefined = undefined;
    let count = 0;
    if (policyQuery.payload?.type === 'PagedResponseOfPolicy') {
        policiesOrUndefined = policyQuery.payload.value.data;
        count = policyQuery.payload.value.count;
    }

    const policyRows = usePolicyRows(policiesOrUndefined, policyQuery.loading, count, policyPage.page);

    const { query } = policyQuery;

    useUpdateEffect(() => {
        if (props.showCreateStep) {
            query();
        }
    }, [ query, policyPage.page, policyFilter.debouncedFilters, props.showCreateStep ]);

    if (props.showCreateStep) {
        return (
            <CreatePolicyStepContext.Provider value={ {
                copyPolicy,
                setCopyPolicy,
                copiedPolicy,
                setCopiedPolicy,
                policyFilter,
                policyPage,
                policySort,
                policyQuery,
                policyRows
            } }>
                { props.children }
            </CreatePolicyStepContext.Provider>
        );
    }

    return (
        <>
            { props.children }
        </>
    );
};
