import { useMutation } from 'react-fetching-library';
import { DeepPartial } from 'ts-essentials';
import { Policy } from '../types/Policy';
import { toServerPolicy } from '../types/adapters/PolicyAdapter';
import { actionPostPoliciesValidate } from '../generated/ActionCreators';

export const actionCreator = (policy: DeepPartial<Policy>) => {
    return actionPostPoliciesValidate({
        body: toServerPolicy(policy)
    });
};

export const useVerifyPolicyMutation = () => {
    return useMutation(actionCreator);
};
