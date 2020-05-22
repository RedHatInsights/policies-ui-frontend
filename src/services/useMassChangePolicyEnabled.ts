import { useMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { actionPostPoliciesIdsEnabled } from '../generated/ActionCreators';

export interface UseMassChangePolicyEnabledParams {
    policyIds: Uuid[];
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UseMassChangePolicyEnabledParams) => actionPostPoliciesIdsEnabled({
    body: params.policyIds,
    enabled: params.shouldBeEnabled
});

export const useMassChangePolicyEnabledMutation = () => useMutation<Uuid[]>(actionCreator);
