import { useParameterizedQuery, useQuery } from 'react-fetching-library';
import { actionGetPoliciesById } from '../generated/ActionCreators';
import { ServerPolicyResponse, Uuid } from '../types/Policy/Policy';
import { useTransformQueryResponse } from '../utils/ApiUtils';
import { toPolicy } from '../types/adapters/PolicyAdapter';

export const actionCreator = (policyId: Uuid) => {
    return actionGetPoliciesById({
        id: policyId
    });
};

export const useGetPolicyQuery = (policyId: Uuid, initFetch = true) => {
    return useTransformQueryResponse(
        useQuery(actionCreator(policyId), initFetch),
        toPolicy
    );
};

export const useGetPolicyParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery<ServerPolicyResponse>(actionCreator),
        toPolicy
    );
};
