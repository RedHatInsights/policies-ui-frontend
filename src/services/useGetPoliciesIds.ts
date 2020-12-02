import { Page } from '@redhat-cloud-services/insights-common-typescript';
import { useParameterizedQuery } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';

export const actionCreator = (page: Page) => {
    return Operations.GetPoliciesIds.actionCreator(page.toQuery());
};

export const useGetPoliciesIdsQuery = () => {
    return useParameterizedQuery(actionCreator);
};
