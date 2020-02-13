import Config from '../config/Config';
import { Policy, PolicyWithOptionalId, ServerPolicyResponse } from '../types/Policy/Policy';
import { Action, useMutation, useQuery } from 'react-fetching-library';
import { Fact } from '../types/Fact';
import { Page } from '../types/Page';
import { toPolicies, toServerPolicy } from '../utils/PolicyAdapter';
import { UsePaginatedQueryResponse, useTransformPaginatedQueryResponse } from '../utils/ApiUtils';

const urls = Config.apis.urls;

type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

const createAction = (method: Method, url: string, queryParams?: any, data?: any): Action => ({
    method,
    endpoint: url + (queryParams ? '?' + new URLSearchParams(queryParams).toString() : ''),
    body: data
});

const useNewQuery = <T>(method: Method, url: string, initFetch?: boolean, queryParams?: any, data?: any) =>
    useQuery(createAction(method, url, queryParams, data), initFetch);

const queryParamsPaginated = (queryParams?: any, page?: Page) => {
    if (!page) {
        page = Page.defaultPage();
    }

    if (!queryParams) {
        queryParams = { };
    }

    queryParams.page = page.index - 1;
    queryParams.pageSize = page.size;

    if (page.sort) {
        queryParams.sortColumn = page.sort.column;
        queryParams.sortDirection = page.sort.direction;
    }

    return queryParams;
};

const useNewPaginatedQuery =
    <T>(method: Method, url: string, page?: Page, initFetch?: boolean, queryParams?: any, data?: any): UsePaginatedQueryResponse<T> => {
        const result = useNewQuery<T>(method, url, initFetch, queryParamsPaginated(queryParams, page), data);
        const itemCount = result.headers?.get('TotalCount');

        return { count: (itemCount ? +itemCount : itemCount) as number, ...result };
    };

export const useGetFactsQuery = (initFetch?: boolean) => useNewQuery<Fact[]>('GET', urls.facts, initFetch);

export const useGetPoliciesQuery = (page?: Page, initFetch?: boolean): UsePaginatedQueryResponse<Policy[]> => {
    return useTransformPaginatedQueryResponse(
        useNewPaginatedQuery<ServerPolicyResponse[]>('GET', urls.policies, page, initFetch),
        toPolicies
    );
};

export const useCreatePolicyMutation = () => {
    return useMutation((policy: PolicyWithOptionalId) => {
        return createAction('POST', urls.policies, { alsoStore: true }, toServerPolicy(policy));
    });
};

export const useVerifyPolicyMutation = () => {
    return useMutation((policy: PolicyWithOptionalId) => {
        return createAction('POST', urls.policies, { alsoStore: false }, toServerPolicy(policy));
    });
};

export const useDeletePolicyMutation = () => {
    return useMutation((policy: Policy) => {
        return createAction('DELETE', urls.policy(policy.id));
    });
};

export const useGetPolicyQuery = (policyId: string, initFetch?: boolean) =>
    useNewQuery<Policy>('GET', urls.policy(policyId), initFetch);
