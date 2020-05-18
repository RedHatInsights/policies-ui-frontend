import { Page } from '../types/Page';
import { useParameterizedQuery } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { actionGetPoliciesIds } from '../generated/ActionCreators';
import { pageToQuery } from './Api/ActionBuilder';

export const actionCreator = (page: Page) => {
    return actionGetPoliciesIds(pageToQuery(page));
};

export const useGetPoliciesIdsQuery = () => {
    return useParameterizedQuery<Uuid[], {}, Page>(actionCreator);
};
