import { useMutation } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { Uuid } from '../types/Policy/Policy';

export interface UseMassChangePolicyEnabledParams {
    policyIds: Uuid[];
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UseMassChangePolicyEnabledParams) => Operations.PostPoliciesIdsEnabled.actionCreator({
    body: params.policyIds,
    enabled: params.shouldBeEnabled
});

export const useMassChangePolicyEnabledMutation = () => useMutation(actionCreator);
