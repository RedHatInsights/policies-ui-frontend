/**
* Generated code, DO NOT modify directly.
* Instead update the openapi in policies-ui-backend and run in policies-ui-frontend
*   `yarn schema` to re-generate this file.
* Note: As the time of writing, the schema is taken from:
*   http://localhost:8080/api/policies/v1.0/openapi.json
*/
import { actionBuilder } from '../services/Api/ActionBuilder';
import { Action } from 'react-fetching-library';
import { withBaseUrl } from '../config/Config';
import * as schemas from './Types';

export interface UseGetPoliciesParams {
    filterOpDescription?: 'equal' | 'like' | 'ilike' | 'not_equal';
    filterOpName?: 'equal' | 'like' | 'ilike' | 'not_equal';
    filterDescription?: string;
    filterIsEnabled?: 'true' | 'false';
    filterName?: string;
    limit?: number;
    offset?: number;
    sortColumn?: 'name' | 'description' | 'is_enabled' | 'mtime';
    sortDirection?: 'asc' | 'desc';
}

export interface UsePostPoliciesParams {
    body?: schemas.Policy;
    alsoStore?: boolean;
}

export interface UseGetPoliciesIdsParams {
    filterOpDescription?: 'equal' | 'like' | 'ilike' | 'not_equal';
    filterOpName?: 'equal' | 'like' | 'ilike' | 'not_equal';
    filterDescription?: string;
    filterIsEnabled?: 'true' | 'false';
    filterName?: string;
}

export interface UseDeletePoliciesIdsParams {
    body?: schemas.ListUUID;
}

export interface UsePostPoliciesIdsEnabledParams {
    body?: schemas.ListUUID;
    enabled?: boolean;
}

export interface UsePostPoliciesValidateParams {
    body?: schemas.Policy;
}

export interface UsePostPoliciesValidateNameParams {
    body?: string;
    id?: schemas.Uuid;
}

export interface UseGetPoliciesByIdParams {
    id: schemas.Uuid;
}

export interface UseDeletePoliciesByIdParams {
    id: schemas.Uuid;
}

export interface UsePostPoliciesByIdEnabledParams {
    id: schemas.Uuid;
    enabled?: boolean;
}

export interface UseGetPoliciesByIdHistoryTriggerParams {
    id: schemas.Uuid;
}

export interface UsePutPoliciesByPolicyIdParams {
    body?: schemas.Policy;
    policyId: schemas.Uuid;
    dry?: boolean;
}

/** Just a filler to have a defined return code for the base path */
export const actionGet = (): Action => {
    const path = withBaseUrl('/');

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

/** Retrieve a list of fact (keys) along with their data types */
export const actionGetFacts = (): Action => {
    const path = withBaseUrl('/facts');

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

/** Return all policies for a given account */
export const actionGetPolicies = (params: UseGetPoliciesParams): Action => {
    const path = withBaseUrl('/policies');

    const query = {} as Record<string, any>;
    query['filter:op[description]'] = params.filterOpDescription;
    query['filter:op[name]'] = params.filterOpName;
    query['filter[description]'] = params.filterDescription;
    query['filter[is_enabled]'] = params.filterIsEnabled;
    query['filter[name]'] = params.filterName;
    query.limit = params.limit;
    query.offset = params.offset;
    query.sortColumn = params.sortColumn;
    query.sortDirection = params.sortDirection;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

/** Validate (and possibly persist) a passed policy for the given account */
export const actionPostPolicies = (params: UsePostPoliciesParams): Action => {
    const path = withBaseUrl('/policies');

    const query = {} as Record<string, any>;
    query.alsoStore = params.alsoStore;

    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

/** Return all policy ids for a given account after applying the filters */
export const actionGetPoliciesIds = (params: UseGetPoliciesIdsParams): Action => {
    const path = withBaseUrl('/policies/ids');

    const query = {} as Record<string, any>;
    query['filter:op[description]'] = params.filterOpDescription;
    query['filter:op[name]'] = params.filterOpName;
    query['filter[description]'] = params.filterDescription;
    query['filter[is_enabled]'] = params.filterIsEnabled;
    query['filter[name]'] = params.filterName;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

/** Delete policies for a customer by the ids passed in the body. Result will be a list of deleted UUIDs */
export const actionDeletePoliciesIds = (params: UseDeletePoliciesIdsParams): Action => {
    const path = withBaseUrl('/policies/ids');

    const query = {} as Record<string, any>;

    return actionBuilder('DELETE', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

/** Enable/disable policies identified by list of uuid in body */
export const actionPostPoliciesIdsEnabled = (params: UsePostPoliciesIdsEnabledParams): Action => {
    const path = withBaseUrl('/policies/ids/enabled');

    const query = {} as Record<string, any>;
    query.enabled = params.enabled;

    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

/** Validates a Policy condition */
export const actionPostPoliciesValidate = (params: UsePostPoliciesValidateParams): Action => {
    const path = withBaseUrl('/policies/validate');

    const query = {} as Record<string, any>;

    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

/** Validates the Policy.name and verifies if it is unique. */
export const actionPostPoliciesValidateName = (params: UsePostPoliciesValidateNameParams): Action => {
    const path = withBaseUrl('/policies/validate-name');

    const query = {} as Record<string, any>;
    query.id = params.id;

    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

/** Retrieve a single policy for a customer by its id */
export const actionGetPoliciesById = (params: UseGetPoliciesByIdParams): Action => {
    const path = withBaseUrl('/policies/{id}')
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

/** Delete a single policy for a customer by its id */
export const actionDeletePoliciesById = (params: UseDeletePoliciesByIdParams): Action => {
    const path = withBaseUrl('/policies/{id}')
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('DELETE', path)
    .queryParams(query)
    .build();
};

/** Enable/disable a policy */
export const actionPostPoliciesByIdEnabled = (params: UsePostPoliciesByIdEnabledParams): Action => {
    const path = withBaseUrl('/policies/{id}/enabled')
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    query.enabled = params.enabled;

    return actionBuilder('POST', path)
    .queryParams(query)
    .build();
};

/** Retrieve the trigger history of a single policy */
export const actionGetPoliciesByIdHistoryTrigger = (params: UseGetPoliciesByIdHistoryTriggerParams): Action => {
    const path = withBaseUrl('/policies/{id}/history/trigger')
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

/** Update a single policy for a customer by its id */
export const actionPutPoliciesByPolicyId = (params: UsePutPoliciesByPolicyIdParams): Action => {
    const path = withBaseUrl('/policies/{policyId}')
    .replace('{policyId}', params.policyId);

    const query = {} as Record<string, any>;

    query.dry = params.dry;

    return actionBuilder('PUT', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

