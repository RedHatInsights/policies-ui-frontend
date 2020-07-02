import { actionGetPoliciesByIdHistoryTrigger } from '../generated/ActionCreators';
import { Uuid } from '../types/Policy/Policy';
import { useParameterizedQuery } from 'react-fetching-library';
import { PagedServerTriggerResponse, PagedTrigger } from '../types/Trigger';
import { toTriggers } from '../types/adapters/TriggerAdapter';
import { pageToQuery, Page, useTransformQueryResponse } from 'common-code-ui';

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
