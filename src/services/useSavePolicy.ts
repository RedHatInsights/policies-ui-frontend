import { NewPolicy } from '../types/Policy/Policy';
import { toPolicy, toServerPolicy } from '../types/adapters/PolicyAdapter';
import { useMutation } from 'react-fetching-library';
import { Operations } from '../generated/Openapi';
import { validatedResponse } from 'openapi2typescript';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';

export const savePolicyActionCreator = (policy: NewPolicy) => {
    if (policy.id) {
        return Operations.PutPoliciesByPolicyId.actionCreator({
            policyId: policy.id,
            body: toServerPolicy(policy)
        });
    }

    return Operations.PostPolicies.actionCreator({
        alsoStore: true,
        body: toServerPolicy(policy)
    });
};

const decoder = (response: Operations.PutPoliciesByPolicyId.Payload | Operations.PostPolicies.Payload) => {
    if (response.type === 'Policy') {
        return validatedResponse(
            'Policy',
            response.status,
            toPolicy(response.value),
            response.errors
        );
    }

    return response;
};

export const useSavePolicyMutation = () => useTransformQueryResponse(useMutation(savePolicyActionCreator), decoder);
