import { NewPolicy } from '../types/Policy/Policy';
import { toServerPolicy } from '../utils/PolicyAdapter';
import { useBulkMutation, useMutation } from 'react-fetching-library';
import { actionPostPolicies, actionPutPoliciesByPolicyId } from '../generated/ActionCreators';

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

export const useSavePolicyMutation = () => useMutation(savePolicyActionCreator);

export const useBulkSavePolicyMutation = () => useBulkMutation(savePolicyActionCreator);
