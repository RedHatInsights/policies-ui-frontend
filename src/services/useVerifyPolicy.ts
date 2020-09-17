import { useMutation } from 'react-fetching-library';
import { DeepPartial } from 'ts-essentials';
import { Policy } from '../types/Policy';
import { toServerPolicy } from '../types/adapters/PolicyAdapter';
import { Operations } from '../generated/Openapi';

export const actionCreator = (policy: DeepPartial<Policy>) => {
    return Operations.PostPoliciesValidate.actionCreator({
        body: toServerPolicy(policy)
    });
};

export const useVerifyPolicyMutation = () => {
    return useMutation(actionCreator);
};
