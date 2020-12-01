import { useBulkMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { Operations } from '../generated/Openapi';

export const actionCreator = (policyId: Uuid) => {
    return Operations.DeletePoliciesById.actionCreator({
        id: policyId
    });
};

export const useBulkDeletePolicyMutation = () => {
    return useBulkMutation(actionCreator);
};
