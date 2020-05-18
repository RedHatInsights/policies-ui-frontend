import { useMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { actionDeletePoliciesIds } from '../generated/ActionCreators';

export const actionCreator = (policyIds: Uuid[]) => actionDeletePoliciesIds({
    body: policyIds
});

export const useMassDeletePoliciesMutation = () => {
    return useMutation<Uuid[]>(actionCreator);
};
