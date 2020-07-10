import { useParameterizedQuery } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { actionGetPoliciesIds } from '../generated/ActionCreators';
import { pageToQuery, Page } from '@redhat-cloud-services/insights-common-typescript';

export const actionCreator = (page: Page) => {
    return actionGetPoliciesIds(pageToQuery(page));
};

export const useGetPoliciesIdsQuery = () => {
    return useParameterizedQuery<Uuid[], {}, Page>(actionCreator);
};
