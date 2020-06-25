import { actionGetPoliciesByIdHistoryTrigger } from '../generated/ActionCreators';
import { Uuid } from '../types/Policy/Policy';
import { useParameterizedQuery } from 'react-fetching-library';
import { PagedServerTriggerResponse, PagedTrigger } from '../types/Trigger';
import { useTransformQueryResponse } from '../utils/ApiUtils';
import { toTriggers } from '../types/adapters/TriggerAdapter';
import { Page } from '../types/Page';
import { pageToQuery } from './Api/ActionBuilder';

export interface UseGetPolicyTriggersParams {
    policyId: Uuid;
    page: Page;
}

export const actionCreator = (params: UseGetPolicyTriggersParams) => {
    return actionGetPoliciesByIdHistoryTrigger({
        id: params.policyId,
        ...pageToQuery(params.page)
    });
};

export const dataToTriggers = (paged: PagedServerTriggerResponse): PagedTrigger => {
    return {
        count: paged.meta?.count || 0,
        data: toTriggers(paged.data)
    };
};

export const useGetPolicyTriggersParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery<PagedServerTriggerResponse, {}, UseGetPolicyTriggersParams>(actionCreator),
        dataToTriggers
    );
};
