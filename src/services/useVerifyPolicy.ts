import { useMutation } from 'react-fetching-library';
import { DeepPartial } from 'ts-essentials';

import { Operations } from '../generated/Openapi';
import { toServerPolicy } from '../types/adapters/PolicyAdapter';
import { Policy } from '../types/Policy';

export const actionCreator = (policy: DeepPartial<Policy>) => {
    return Operations.PostPoliciesValidate.actionCreator({
        body: toServerPolicy(policy)
    });
};

export const useVerifyPolicyMutation = () => {
    return useMutation(actionCreator);
};
