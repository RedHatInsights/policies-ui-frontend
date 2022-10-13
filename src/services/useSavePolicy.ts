import { useMutation } from '@tanstack/react-query';

import { policiesApi } from '../app/PoliciesAPI';
import { toPolicy, toServerAction } from '../types/adapters/PolicyAdapter';
import { NewPolicy } from '../types/Policy/Policy';

const toServerPolicy = (policy: NewPolicy) => ({
    id: policy.id,
    name: policy.name,
    description: policy.description,
    conditions: policy.conditions,
    actions: policy.actions ? toServerAction(policy.actions) : '',
    isEnabled: policy.isEnabled
});

export const useSavePolicyMutation = () => useMutation(async (policy: NewPolicy) => {
    let response;

    if (policy.id) {
        response = await policiesApi.policies.putPoliciesByPolicyId(policy.id, false, toServerPolicy(policy));
    } else {
        response = await policiesApi.policies.postPolicies(true, toServerPolicy(policy));
    }

    return toPolicy(response.data);
});
