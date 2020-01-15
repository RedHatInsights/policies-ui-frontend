import Config from '../config/Config';
import { Policy } from '../types/Policy/Policy';
import { useQuery } from 'react-fetching-library';
import { Fact } from '../types/Fact';
import { Page } from './Page';

const urls = Config.apis.urls;

type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

const useNewQuery = <T>(method: Method, url: string, initFetch?: boolean, queryParams?: any, data?: any) => useQuery({
    method,
    endpoint: url + (queryParams ? '?' + new URLSearchParams(queryParams).toString() : ''),
    body: data
}, initFetch);

const queryParamsPaginated = (queryParams?: any, page?: Page) => {
    if (!page) {
        page = Page.defaultPage();
    }

    if (!queryParams) {
        queryParams = { };
    }

    queryParams.page = page.index - 1;
    queryParams.pageSize = page.size;
    return queryParams;
};

const useNewPaginatedQuery = <T>(method: Method, url: string, page?: Page, initFetch?: boolean, queryParams?: any, data?: any) => {
    const result = useNewQuery<T>(method, url, initFetch, queryParamsPaginated(queryParams, page), data);
    const itemCount = result.headers?.get('TotalCount');

    return { count: (itemCount ? +itemCount : itemCount) as number, ...result };
};

export const useGetFactsQuery = (initFetch?: boolean) => useNewQuery<Fact[]>('GET', urls.facts, initFetch);
export const useGetPoliciesQuery = (page?: Page, initFetch?: boolean) =>
    useNewPaginatedQuery<Policy[]>('GET', urls.policies, page, initFetch);
export const useCreatePolicyQuery = (policy: Policy, initFetch?: boolean) => useNewQuery<void>('POST', urls.policies, initFetch, {}, policy);
export const useGetCustomerPolicyQuery = (policyId: string, initFetch?: boolean) =>
    useNewQuery<Policy>('GET', urls.customerPolicy(policyId), initFetch);
