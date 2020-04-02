import { NewPolicy } from '../types/Policy/Policy';
import { toServerPolicy } from '../utils/PolicyAdapter';
import { useMutation } from 'react-fetching-library';
import { useBulkMutation } from '../hooks';
import { createAction } from './Api';
import Config from '../config/Config';

const urls = Config.apis.urls;

export const savePolicyActionCreator = (policy: NewPolicy) => {
    if (policy.id) {
        return createAction('PUT', urls.policy(policy.id), {}, toServerPolicy(policy));
    }

    return createAction('POST', urls.policies, { alsoStore: true }, toServerPolicy(policy));
};

export const useSavePolicyMutation = () => useMutation(savePolicyActionCreator);

export const useBulkSavePolicyMutation = () => useBulkMutation(savePolicyActionCreator);
