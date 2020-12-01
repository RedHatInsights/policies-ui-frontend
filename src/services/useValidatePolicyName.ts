import { useParameterizedQuery } from 'react-fetching-library';
import { Policy } from '../types/Policy';
import { Operations } from '../generated/Openapi';

export const actionCreator = (policy: Partial<Policy>) => {
    return Operations.PostPoliciesValidateName.actionCreator({
        body: policy.name ?? '',
        id: policy.id
    });
};

export const useValidatePolicyNameParametrizedQuery = () => {
    return useParameterizedQuery(actionCreator);
};
