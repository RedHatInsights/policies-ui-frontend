import { useBulkMutation } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { Uuid } from '../types/Policy/Policy';

export const actionCreator = (policyId: Uuid) => {
    return Operations.DeletePoliciesById.actionCreator({
        id: policyId
    });
};

export const useBulkDeletePolicyMutation = () => {
    return useBulkMutation(actionCreator);
};
