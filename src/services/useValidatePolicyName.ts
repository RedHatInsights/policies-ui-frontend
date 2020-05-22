import { useParameterizedQuery } from 'react-fetching-library';
import { Policy } from '../types/Policy';
import { actionPostPoliciesValidateName } from '../generated/ActionCreators';

export const actionCreator = (policy: Partial<Policy>) => {
    return actionPostPoliciesValidateName({
        body: policy.name,
        id: policy.id
    });
};

export const useValidatePolicyNameParametrizedQuery = () => {
    return useParameterizedQuery(actionCreator);
};
