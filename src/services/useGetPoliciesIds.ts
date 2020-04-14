import { Page } from '../types/Page';
import { paginatedActionBuilder } from './Api/PaginatedActionBuilder';
import Config from '../config/Config';
import { useParameterizedQuery } from 'react-fetching-library';
import { PagedServerUuidResponse } from '../types/Policy/Policy';

const url = Config.apis.urls.policyIds;

export const actionCreator = (page: Page) => {
    return paginatedActionBuilder('GET', url).page(page).build();
};

export const useGetPoliciesIdsQuery = () => {
    return useParameterizedQuery<PagedServerUuidResponse, {}, Page>(actionCreator);
};
