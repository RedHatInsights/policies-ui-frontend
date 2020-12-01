import { useMutation } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { Uuid } from '../types/Policy/Policy';

export const actionCreator = (policyIds: Uuid[]) => Operations.DeletePoliciesIds.actionCreator({
    body: policyIds
});

export const useMassDeletePoliciesMutation = () => {
    return useMutation(actionCreator);
};
