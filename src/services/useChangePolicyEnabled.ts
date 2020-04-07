import Config from '../config/Config';
import { actionBuilder } from './Api/ActionBuilder';
import { useBulkMutation } from 'react-fetching-library';

const url = Config.apis.urls.policyEnabled;

export interface UsePolicyEnabledParams {
    policyId: string;
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UsePolicyEnabledParams) =>
    actionBuilder('POST', url(params.policyId)).queryParams({ enabled: params.shouldBeEnabled.toString() }).build();

export const useBulkChangePolicyEnabledMutation = () => useBulkMutation(actionCreator);
