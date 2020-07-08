import { pageToQuery, useTransformQueryResponse, Page } from '@redhat-cloud-services/insights-common-typescript';
import { Policy } from '../types/Policy';
import { useNewPaginatedQuery, UsePaginatedQueryResponse } from '../hooks';
import { PagedServerPolicyResponse } from '../types/Policy/Policy';
import { toPolicies } from '../types/adapters/PolicyAdapter';
import { useQuery } from 'react-fetching-library';
import { actionGetPolicies } from '../generated/ActionCreators';

export const actionCreator = (page?: Page) => actionGetPolicies(pageToQuery(page));

export const useGetPoliciesQuery = (page?: Page, initFetch?: boolean): UsePaginatedQueryResponse<Policy[]> => {
    return useTransformQueryResponse(
        useNewPaginatedQuery<PagedServerPolicyResponse>(actionCreator(page), initFetch),
        toPolicies
    );
};

const policiesToBooleanAdapter = (pagedPolicyResponse: PagedServerPolicyResponse) => {
    return pagedPolicyResponse.data?.length;
};

export const hasPoliciesQueryActionCreator = () => actionGetPolicies((pageToQuery(Page.of(1, 1))));

export const useHasPoliciesQuery = () => {
    return useTransformQueryResponse(
        useQuery<PagedServerPolicyResponse>(hasPoliciesQueryActionCreator(), false),
        policiesToBooleanAdapter
    );
};
