import { useParameterizedQuery } from 'react-fetching-library';
import { Policy } from '../types/Policy';
import { actionBuilder } from './Api/ActionBuilder';
import Config from '../config/Config';

const url = Config.apis.urls.validatePolicyName;

export const actionCreator = (policy: Partial<Policy>) => {
    actionBuilder('POST', url).data(policy.name).queryParams({
        id: policy.id
    }).build();
};

export const useValidatePolicyNameParametrizedQuery = () => {
    return useParameterizedQuery(actionCreator);
};
