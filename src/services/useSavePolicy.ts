import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useMutation } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { toPolicy, toServerPolicy } from '../types/adapters/PolicyAdapter';
import { NewPolicy } from '../types/Policy/Policy';

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

const decoder = validationResponseTransformer((response: Operations.PutPoliciesByPolicyId.Payload | Operations.PostPolicies.Payload) => {
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

export const useSavePolicyMutation = () => useTransformQueryResponse(useMutation(savePolicyActionCreator), decoder);
