import Config from '../config/Config';
import { Policy } from '../types/Policy/Policy';
import { useMutation, useQuery } from 'react-fetching-library';
import { toServerPolicy } from '../utils/PolicyAdapter';
import { DeepPartial } from 'ts-essentials';
import { actionBuilder } from './Api/ActionBuilder';

const urls = Config.apis.urls;

export const useVerifyPolicyMutation = () => {
    return useMutation((policy: DeepPartial<Policy>) => {
        return actionBuilder('POST', urls.validateCondition).data(toServerPolicy(policy)).build();
    });
};

export const useGetPolicyQuery = (policyId: string, initFetch?: boolean) =>
    useQuery<Policy>(actionBuilder('GET', urls.policy(policyId)).build(), initFetch);
