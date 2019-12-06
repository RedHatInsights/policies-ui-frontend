import axios, { Method } from 'axios';
import Config from '../config/Config';
import { Policy } from '../types/Policy/Policy';
import { Fact } from '../types/Fact';

const urls = Config.apis.urls;

const newRequest = <T>(method: Method, url: string, queryParams?: any, data?: any) =>
    axios.request<T>({
        method,
        url,
        data,
        params: queryParams
    });

export const getFacts = () => newRequest<Fact[]>('GET', urls.facts);

export const getPolicies = (customerId: string) => newRequest<Policy[]>('GET', urls.policies(customerId));

export const createPolicy = (policy: Policy) => newRequest<void>('POST', urls.policies(policy.customerid), {}, policy);

export const getCustomerPolicy = (customerId: string, policyId: string) => newRequest<Policy>('GET', urls.customerPolicy(customerId, policyId));
