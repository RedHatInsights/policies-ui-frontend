import { useMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { Operations } from '../generated/Openapi';

export interface UseMassChangePolicyEnabledParams {
    policyIds: Uuid[];
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UseMassChangePolicyEnabledParams) => Operations.PostPoliciesIdsEnabled.actionCreator({
    body: params.policyIds,
    enabled: params.shouldBeEnabled
});

export const useMassChangePolicyEnabledMutation = () => useMutation<Uuid[]>(actionCreator);
