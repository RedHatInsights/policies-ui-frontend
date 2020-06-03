import { useQuery } from 'react-fetching-library';
import { actionGetPoliciesById } from '../generated/ActionCreators';
import { Uuid } from '../types/Policy/Policy';
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
