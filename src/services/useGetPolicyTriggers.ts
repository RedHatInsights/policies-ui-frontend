import { Uuid } from '../types/Policy/Policy';
import { useParameterizedQuery } from 'react-fetching-library';
import { toTriggers } from '../types/adapters/TriggerAdapter';
import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { Operations } from '../generated/Openapi';

export interface UseGetPolicyTriggersParams {
    policyId: Uuid;
    page: Page;
}

export const actionCreator = (params: UseGetPolicyTriggersParams) => {
    return Operations.GetPoliciesByIdHistoryTrigger.actionCreator({
        id: params.policyId,
        ...params.page.toQuery()
    });
};

export const dataToTriggers = (validatedResponse: Operations.GetPoliciesByIdHistoryTrigger.Payload) => {
    if (validatedResponse.type === 'PagedResponseOfHistoryItem') {
        const value = validatedResponse.value;

        return {
            ...validatedResponse,
            type: 'PagedTriggers',
            value: {
                count: value.meta?.count || 0,
                data: toTriggers(value.data ?? [])
            }
        };
    }

    return validatedResponse;
};

export const useGetPolicyTriggersParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery(actionCreator),
        dataToTriggers
    );
};

const triggersToBooleanAdapter = (validatedResponse: Operations.GetPoliciesByIdHistoryTrigger.Payload) => {
    if (validatedResponse.type === 'PagedResponseOfHistoryItem') {
        return {
            ...validatedResponse,
            type: 'boolean',
            value: validatedResponse.value.data && validatedResponse.value.data.length
        };
    }

    return validatedResponse;
};

export const hasTriggersQueryActionCreator = (policyId: Uuid) => Operations.GetPoliciesByIdHistoryTrigger.actionCreator({
    id: policyId,
    ...Page.of(1, 1).toQuery()
});

export const useHasPolicyTriggersParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery(hasTriggersQueryActionCreator),
        triggersToBooleanAdapter
    );
};
