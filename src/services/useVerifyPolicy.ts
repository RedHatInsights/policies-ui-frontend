import { useMutation } from 'react-fetching-library';
import { DeepPartial } from 'ts-essentials';
import { Policy } from '../types/Policy';
import { toServerPolicy } from '../utils/PolicyAdapter';
import { actionPostPoliciesValidate } from '../generated/ActionCreators';

export const useVerifyPolicyMutation = () => {
    return useMutation((policy: DeepPartial<Policy>) => {
        return actionPostPoliciesValidate({
            body: toServerPolicy(policy)
        });
    });
};
