import { useBulkMutation } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { Uuid } from '../types/Policy/Policy';

export interface UsePolicyEnabledParams {
    policyId: Uuid;
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UsePolicyEnabledParams) => Operations.PostPoliciesByIdEnabled.actionCreator({
    id: params.policyId,
    enabled: params.shouldBeEnabled
});

export const useBulkChangePolicyEnabledMutation = () => useBulkMutation(actionCreator);
