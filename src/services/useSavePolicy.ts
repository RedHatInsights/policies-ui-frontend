import { NewPolicy, ServerPolicyResponse } from '../types/Policy/Policy';
import { toPolicy, toServerPolicy } from '../types/adapters/PolicyAdapter';
import { useMutation } from 'react-fetching-library';
import { actionPostPolicies, actionPutPoliciesByPolicyId } from '../generated/ActionCreators';
import { useTransformQueryResponse } from 'common-code-ui';

export const savePolicyActionCreator = (policy: NewPolicy) => {
    if (policy.id) {
        return actionPutPoliciesByPolicyId({
            policyId: policy.id,
            body: toServerPolicy(policy)
        });
    }

    return actionPostPolicies({
        alsoStore: true,
        body: toServerPolicy(policy)
    });
};

export const useSavePolicyMutation = () => useTransformQueryResponse(useMutation<ServerPolicyResponse>(savePolicyActionCreator), toPolicy);
