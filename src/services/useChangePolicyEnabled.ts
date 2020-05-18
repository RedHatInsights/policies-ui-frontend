import { useBulkMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { actionPostPoliciesByIdEnabled } from '../generated/ActionCreators';

export interface UsePolicyEnabledParams {
    policyId: Uuid;
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UsePolicyEnabledParams) => actionPostPoliciesByIdEnabled({
    id: params.policyId,
    enabled: params.shouldBeEnabled
});

export const useBulkChangePolicyEnabledMutation = () => useBulkMutation(actionCreator);
