import { createAction } from './Api';
import Config from '../config/Config';
import { useBulkMutation } from '../hooks';

const url = Config.apis.urls.policyEnabled;

export interface UsePolicyEnabledParams {
    policyId: string;
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UsePolicyEnabledParams) => createAction('POST', url(params.policyId), { enabled: params.shouldBeEnabled });

export const useBulkChangePolicyEnabledMutation = () => useBulkMutation(actionCreator);
