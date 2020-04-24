import Config from '../config/Config';
import { useBulkMutation } from 'react-fetching-library';
import { Uuid } from '../types/Policy/Policy';
import { actionBuilder } from './Api/ActionBuilder';

const url = Config.apis.urls.policy;

export const actionCreator = (policyId: Uuid) => {
    return actionBuilder('DELETE', url(policyId)).build();
};

export const useBulkDeletePolicyMutation = () => {
    return useBulkMutation(actionCreator);
};
