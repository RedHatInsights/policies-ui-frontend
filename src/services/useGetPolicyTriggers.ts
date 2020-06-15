import { actionGetPoliciesByIdHistoryTrigger } from '../generated/ActionCreators';
import { Uuid } from '../types/Policy/Policy';
import { useParameterizedQuery } from 'react-fetching-library';
import { PagedServerTriggerResponse } from '../types/Trigger';
import { useTransformQueryResponse } from '../utils/ApiUtils';
import { toTriggers } from '../types/adapters/TriggerAdapter';
import { Page } from '../types/Page';
import { pageToQuery } from './Api/ActionBuilder';

export interface UseGetPolicyTriggersParams {
    policyId: Uuid;
    page: Page;
}

const actionCreator = (params: UseGetPolicyTriggersParams) => {
    return actionGetPoliciesByIdHistoryTrigger({
        id: params.policyId,
        ...pageToQuery(params.page)
    });
};

export const useGetPolicyTriggersParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery<PagedServerTriggerResponse, {}, UseGetPolicyTriggersParams>(actionCreator),
        toTriggers
    );
};
