import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useParameterizedQuery, useQuery } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { toPolicy } from '../types/adapters/PolicyAdapter';
import { Uuid } from '../types/Policy/Policy';

export const actionCreator = (policyId: Uuid) => {
    return Operations.GetPoliciesById.actionCreator({
        id: policyId
    });
};

const decoder = validationResponseTransformer((response: Operations.GetPoliciesById.Payload) => {
    if (response.type === 'Policy') {
        return validatedResponse(
            'Policy',
            response.status,
            toPolicy(response.value),
            response.errors
        );
    }

    return response;
});

export const useGetPolicyQuery = (policyId: Uuid, initFetch = true) => {
    return useTransformQueryResponse(
        useQuery(actionCreator(policyId), initFetch),
        decoder
    );
};

export const useGetPolicyParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery(actionCreator),
        decoder
    );
};
