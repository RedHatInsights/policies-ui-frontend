import Config from '../config/Config';
import { actionBuilder } from './Api/ActionBuilder';
import { useMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';

const url = Config.apis.urls.policyIdsEnabled;

export interface UseMassChangePolicyEnabledParams {
    policyIds: Uuid[];
    shouldBeEnabled: boolean;
}

export const actionCreator = (params: UseMassChangePolicyEnabledParams) =>
    actionBuilder('POST', url).data(params.policyIds).queryParams({ enabled: params.shouldBeEnabled.toString() }).build();

export const useMassChangePolicyEnabledMutation = () => useMutation<Uuid[]>(actionCreator);
