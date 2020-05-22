import { useBulkMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { actionDeletePoliciesById } from '../generated/ActionCreators';

export const actionCreator = (policyId: Uuid) => {
    return actionDeletePoliciesById({
        id: policyId
    });
};

export const useBulkDeletePolicyMutation = () => {
    return useBulkMutation(actionCreator);
};
