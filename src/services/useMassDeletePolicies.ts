import { useMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { Operations } from '../generated/Openapi';

export const actionCreator = (policyIds: Uuid[]) => Operations.DeletePoliciesIds.actionCreator({
    body: policyIds
});

export const useMassDeletePoliciesMutation = () => {
    return useMutation(actionCreator);
};
