import Config from '../config/Config';
import { useMutation } from 'react-fetching-library';
import { PagedServerUuidResponse, Uuid } from '../types/Policy/Policy';
import { actionBuilder } from './Api/ActionBuilder';

const url = Config.apis.urls.policyIds;

export const actionCreator = (policyIds: Uuid[]) => {
    return actionBuilder('DELETE', url).data(policyIds).build();
};

export const useMassDeletePoliciesMutation = () => {
    return useMutation<PagedServerUuidResponse>(actionCreator);
};
