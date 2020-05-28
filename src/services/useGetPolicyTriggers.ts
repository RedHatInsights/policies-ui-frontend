import { actionGetPoliciesByIdHistoryTrigger } from '../generated/ActionCreators';
import { Uuid } from '../types/Policy/Policy';
import { useParameterizedQuery } from 'react-fetching-library';
import { ServerTrigger } from '../types/Trigger';
import { useTransformQueryResponse } from '../utils/ApiUtils';
import { toTriggers } from '../types/adapters/TriggerAdapter';

const actionCreator = (policyId: Uuid) => {
    return actionGetPoliciesByIdHistoryTrigger({
        id: policyId
    });
};

export const useGetPolicyTriggersParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery<ServerTrigger[]>(actionCreator),
        toTriggers
    );
};
