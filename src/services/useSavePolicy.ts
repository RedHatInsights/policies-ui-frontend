import { NewPolicy } from '../types/Policy/Policy';
import { toServerPolicy } from '../utils/PolicyAdapter';
import { useBulkMutation, useMutation } from 'react-fetching-library';
import Config from '../config/Config';
import { actionBuilder } from './Api/ActionBuilder';

const urls = Config.apis.urls;

export const savePolicyActionCreator = (policy: NewPolicy) => {
    if (policy.id) {
        return actionBuilder('PUT', urls.policy(policy.id)).data(toServerPolicy(policy)).build();
    }

    return actionBuilder('POST', urls.policies).queryParams({ alsoStore: true }).data(toServerPolicy(policy)).build();
};

export const useSavePolicyMutation = () => useMutation(savePolicyActionCreator);

export const useBulkSavePolicyMutation = () => useBulkMutation(savePolicyActionCreator);
