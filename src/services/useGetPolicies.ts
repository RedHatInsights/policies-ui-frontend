import { Page } from '../types/Page';
import { UsePaginatedQueryResponse, useTransformQueryResponse } from '../utils/ApiUtils';
import { Policy } from '../types/Policy';
import { useNewPaginatedQuery } from '../hooks';
import { PagedServerPolicyResponse } from '../types/Policy/Policy';
import { paginatedActionBuilder } from './Api/PaginatedActionBuilder';
import { toPolicies } from '../utils/PolicyAdapter';
import Config from '../config/Config';

const urls = Config.apis.urls;

export const actionCreator = (page?: Page) => paginatedActionBuilder('GET', urls.policies).page(page).build();

export const useGetPoliciesQuery = (page?: Page, initFetch?: boolean): UsePaginatedQueryResponse<Policy[]> => {
    return useTransformQueryResponse(
        useNewPaginatedQuery<PagedServerPolicyResponse>(actionCreator(page), initFetch),
        toPolicies
    );
};
