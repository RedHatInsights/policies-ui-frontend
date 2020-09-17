import { useTransformQueryResponse, Page } from '@redhat-cloud-services/insights-common-typescript';
import { Policy } from '../types/Policy';
import { useNewPaginatedQuery, UsePaginatedQueryResponse } from '../hooks';
import { PagedServerPolicyResponse } from '../types/Policy/Policy';
import { toPolicies } from '../types/adapters/PolicyAdapter';
import { useQuery } from 'react-fetching-library';
import { Operations } from '../generated/Openapi';

export const actionCreator = (page?: Page) => Operations.GetPolicies.actionCreator(page?.toQuery() ?? {});

export const useGetPoliciesQuery = (page?: Page, initFetch?: boolean): UsePaginatedQueryResponse<Policy[]> => {
    return useTransformQueryResponse(
        useNewPaginatedQuery<PagedServerPolicyResponse>(actionCreator(page), initFetch),
        toPolicies
    );
};

const policiesToBooleanAdapter = (pagedPolicyResponse: PagedServerPolicyResponse) => {
    return pagedPolicyResponse.data?.length;
};

export const hasPoliciesQueryActionCreator = () => Operations.GetPolicies.actionCreator((Page.of(1, 1).toQuery()));

export const useHasPoliciesQuery = () => {
    return useTransformQueryResponse(
        useQuery<PagedServerPolicyResponse>(hasPoliciesQueryActionCreator(), false),
        policiesToBooleanAdapter
    );
};
