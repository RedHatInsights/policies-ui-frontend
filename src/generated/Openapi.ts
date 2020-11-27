/* eslint-disable */
/**
 * Generated code, DO NOT modify directly.
 */
import * as z from 'zod';
import { ValidatedResponse } from 'openapi2typescript';
import { Action } from 'react-fetching-library';
import { ValidateRule } from 'openapi2typescript';
import {
    actionBuilder,
    ActionValidatableConfig
} from 'openapi2typescript/react-fetching-library';

export namespace Schemas {
  export const Fact = zodSchemaFact();
  export type Fact = {
    id?: number | undefined | null;
    name?: string | undefined | null;
    type?: FactType | undefined | null;
  };

  export const FactType = zodSchemaFactType();
  export type FactType = 'BOOLEAN' | 'INT' | 'LIST' | 'STRING';

  export const HistoryItem = zodSchemaHistoryItem();
  export type HistoryItem = {
    ctime?: number | undefined | null;
    hostName?: string | undefined | null;
    id?: string | undefined | null;
  };

  export const ListHistoryItem = zodSchemaListHistoryItem();
  export type ListHistoryItem = Array<HistoryItem>;

  export const ListPolicy = zodSchemaListPolicy();
  export type ListPolicy = Array<Policy>;

  export const ListUUID = zodSchemaListUUID();
  export type ListUUID = Array<string>;

  export const MapStringString = zodSchemaMapStringString();
  export type MapStringString = {
    [x: string]: string;
  };

  export const Meta = zodSchemaMeta();
  export type Meta = {
    count?: number | undefined | null;
  };

  export const Msg = zodSchemaMsg();
  export type Msg = {
    msg?: string | undefined | null;
  };

  export const PagedResponseOfHistoryItem = zodSchemaPagedResponseOfHistoryItem();
  export type PagedResponseOfHistoryItem = {
    data?: ListHistoryItem | undefined | null;
    links?: MapStringString | undefined | null;
    meta?: Meta | undefined | null;
  };

  export const PagedResponseOfPolicy = zodSchemaPagedResponseOfPolicy();
  export type PagedResponseOfPolicy = {
    data?: ListPolicy | undefined | null;
    links?: MapStringString | undefined | null;
    meta?: Meta | undefined | null;
  };

  export const Policy = zodSchemaPolicy();
  export type Policy = {
    actions?: string | undefined | null;
    conditions: string;
    ctime?: string | undefined | null;
    description?: string | undefined | null;
    id?: UUID | undefined | null;
    isEnabled?: boolean | undefined | null;
    lastTriggered?: number | undefined | null;
    mtime?: string | undefined | null;
    name: string;
  };

  export const UUID = zodSchemaUUID();
  export type UUID = string;

  export const __Empty = zodSchema__Empty();
  export type __Empty = string | undefined;

  function zodSchemaFact() {
      return z
      .object({
          id: z.number().int().optional().nullable(),
          name: z.string().optional().nullable(),
          type: zodSchemaFactType().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaFactType() {
      return z.enum([ 'BOOLEAN', 'INT', 'LIST', 'STRING' ]);
  }

  function zodSchemaHistoryItem() {
      return z
      .object({
          ctime: z.number().int().optional().nullable(),
          hostName: z.string().optional().nullable(),
          id: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaListHistoryItem() {
      return z.array(zodSchemaHistoryItem());
  }

  function zodSchemaListPolicy() {
      return z.array(zodSchemaPolicy());
  }

  function zodSchemaListUUID() {
      return z.array(z.string());
  }

  function zodSchemaMapStringString() {
      return z.record(z.string());
  }

  function zodSchemaMeta() {
      return z
      .object({
          count: z.number().int().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMsg() {
      return z
      .object({
          msg: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaPagedResponseOfHistoryItem() {
      return z
      .object({
          data: zodSchemaListHistoryItem().optional().nullable(),
          links: zodSchemaMapStringString().optional().nullable(),
          meta: zodSchemaMeta().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaPagedResponseOfPolicy() {
      return z
      .object({
          data: zodSchemaListPolicy().optional().nullable(),
          links: zodSchemaMapStringString().optional().nullable(),
          meta: zodSchemaMeta().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaPolicy() {
      return z
      .object({
          actions: z.string().optional().nullable(),
          conditions: z.string(),
          ctime: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          isEnabled: z.boolean().optional().nullable(),
          lastTriggered: z.number().int().optional().nullable(),
          mtime: z.string().optional().nullable(),
          name: z.string()
      })
      .nonstrict();
  }

  function zodSchemaUUID() {
      return z.string();
  }

  function zodSchema__Empty() {
      return z.string().max(0).optional();
  }
}

export namespace Operations {
  // GET /
  // Just a filler to have a defined return code for the base path
  export namespace Get {
    export type Payload =
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
        const path = '/api/policies/v1.0/';
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Schemas.__Empty, '__Empty', 404) ]
        })
        .build();
    };
  }
  // GET /facts
  // Retrieve a list of fact (keys) along with their data types
  export namespace GetFacts {
    const Response200 = z.array(Schemas.Fact);
    type Response200 = Array<Schemas.Fact>;
    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
        const path = '/api/policies/v1.0/facts';
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'Response200', 200) ]
        })
        .build();
    };
  }
  // GET /policies
  // Return all policies for a given account
  export namespace GetPolicies {
    const FilterOpDescription = z.enum([ 'equal', 'like', 'ilike', 'not_equal' ]);
    type FilterOpDescription = 'equal' | 'like' | 'ilike' | 'not_equal';
    const FilterOpName = z.enum([ 'equal', 'like', 'ilike', 'not_equal' ]);
    type FilterOpName = 'equal' | 'like' | 'ilike' | 'not_equal';
    const FilterDescription = z.string();
    type FilterDescription = string;
    const FilterIsEnabled = z.enum([ 'true', 'false' ]);
    type FilterIsEnabled = 'true' | 'false';
    const FilterName = z.string();
    type FilterName = string;
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const SortColumn = z.enum([ 'name', 'description', 'is_enabled', 'mtime' ]);
    type SortColumn = 'name' | 'description' | 'is_enabled' | 'mtime';
    const SortDirection = z.enum([ 'asc', 'desc' ]);
    type SortDirection = 'asc' | 'desc';
    export interface Params {
      filterOpDescription?: FilterOpDescription;
      filterOpName?: FilterOpName;
      filterDescription?: FilterDescription;
      filterIsEnabled?: FilterIsEnabled;
      filterName?: FilterName;
      limit?: Limit;
      offset?: Offset;
      sortColumn?: SortColumn;
      sortDirection?: SortDirection;
    }

    export type Payload =
      | ValidatedResponse<
          'PagedResponseOfPolicy',
          200,
          Schemas.PagedResponseOfPolicy
        >
      | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies';
        const query = {} as Record<string, any>;
        if (params.filterOpDescription !== undefined) {
            query['filter:op[description]'] = params.filterOpDescription;
        }

        if (params.filterOpName !== undefined) {
            query['filter:op[name]'] = params.filterOpName;
        }

        if (params.filterDescription !== undefined) {
            query['filter[description]'] = params.filterDescription;
        }

        if (params.filterIsEnabled !== undefined) {
            query['filter[is_enabled]'] = params.filterIsEnabled;
        }

        if (params.filterName !== undefined) {
            query['filter[name]'] = params.filterName;
        }

        if (params.limit !== undefined) {
            query.limit = params.limit;
        }

        if (params.offset !== undefined) {
            query.offset = params.offset;
        }

        if (params.sortColumn !== undefined) {
            query.sortColumn = params.sortColumn;
        }

        if (params.sortDirection !== undefined) {
            query.sortDirection = params.sortDirection;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(
                    Schemas.PagedResponseOfPolicy,
                    'PagedResponseOfPolicy',
                    200
                ),
                new ValidateRule(Schemas.__Empty, '__Empty', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 404)
            ]
        })
        .build();
    };
  }
  // POST /policies
  // Validate (and possibly persist) a passed policy for the given account
  export namespace PostPolicies {
    const AlsoStore = z.boolean();
    type AlsoStore = boolean;
    export interface Params {
      alsoStore?: AlsoStore;
      body: Schemas.Policy;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
      | ValidatedResponse<'Policy', 201, Schemas.Policy>
      | ValidatedResponse<'Msg', 400, Schemas.Msg>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'Msg', 409, Schemas.Msg>
      | ValidatedResponse<'__Empty', 500, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies';
        const query = {} as Record<string, any>;
        if (params.alsoStore !== undefined) {
            query.alsoStore = params.alsoStore;
        }

        return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Schemas.__Empty, '__Empty', 200),
                new ValidateRule(Schemas.Policy, 'Policy', 201),
                new ValidateRule(Schemas.Msg, 'Msg', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Schemas.Msg, 'Msg', 409),
                new ValidateRule(Schemas.__Empty, '__Empty', 500)
            ]
        })
        .build();
    };
  }
  // GET /policies/ids
  // Return all policy ids for a given account after applying the filters
  export namespace GetPoliciesIds {
    const FilterOpDescription = z.enum([ 'equal', 'like', 'ilike', 'not_equal' ]);
    type FilterOpDescription = 'equal' | 'like' | 'ilike' | 'not_equal';
    const FilterOpName = z.enum([ 'equal', 'like', 'ilike', 'not_equal' ]);
    type FilterOpName = 'equal' | 'like' | 'ilike' | 'not_equal';
    const FilterDescription = z.string();
    type FilterDescription = string;
    const FilterIsEnabled = z.enum([ 'true', 'false' ]);
    type FilterIsEnabled = 'true' | 'false';
    const FilterName = z.string();
    type FilterName = string;
    const Response200 = z.array(Schemas.UUID);
    type Response200 = Array<Schemas.UUID>;
    export interface Params {
      filterOpDescription?: FilterOpDescription;
      filterOpName?: FilterOpName;
      filterDescription?: FilterDescription;
      filterIsEnabled?: FilterIsEnabled;
      filterName?: FilterName;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/ids';
        const query = {} as Record<string, any>;
        if (params.filterOpDescription !== undefined) {
            query['filter:op[description]'] = params.filterOpDescription;
        }

        if (params.filterOpName !== undefined) {
            query['filter:op[name]'] = params.filterOpName;
        }

        if (params.filterDescription !== undefined) {
            query['filter[description]'] = params.filterDescription;
        }

        if (params.filterIsEnabled !== undefined) {
            query['filter[is_enabled]'] = params.filterIsEnabled;
        }

        if (params.filterName !== undefined) {
            query['filter[name]'] = params.filterName;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Response200, 'Response200', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 404)
            ]
        })
        .build();
    };
  }
  // DELETE /policies/ids
  // Delete policies for a customer by the ids passed in the body. Result will be a list of deleted UUIDs
  export namespace DeletePoliciesIds {
    const Response200 = z.array(Schemas.UUID);
    type Response200 = Array<Schemas.UUID>;
    export interface Params {
      body: Schemas.ListUUID;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/ids';
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Response200, 'Response200', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // POST /policies/ids/enabled
  // Enable/disable policies identified by list of uuid in body
  export namespace PostPoliciesIdsEnabled {
    const Enabled = z.boolean();
    type Enabled = boolean;
    const Response200 = z.array(Schemas.UUID);
    type Response200 = Array<Schemas.UUID>;
    export interface Params {
      enabled?: Enabled;
      body: Schemas.ListUUID;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/ids/enabled';
        const query = {} as Record<string, any>;
        if (params.enabled !== undefined) {
            query.enabled = params.enabled;
        }

        return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Response200, 'Response200', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // POST /policies/validate
  // Validates a Policy condition
  export namespace PostPoliciesValidate {
    export interface Params {
      body: Schemas.Policy;
    }

    export type Payload =
      | ValidatedResponse<'Msg', 200, Schemas.Msg>
      | ValidatedResponse<'Msg', 400, Schemas.Msg>
      | ValidatedResponse<'__Empty', 500, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/validate';
        const query = {} as Record<string, any>;
        return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Schemas.Msg, 'Msg', 200),
                new ValidateRule(Schemas.Msg, 'Msg', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 500)
            ]
        })
        .build();
    };
  }
  // POST /policies/validate-name
  // Validates the Policy.name and verifies if it is unique.
  export namespace PostPoliciesValidateName {
    const Body = z.string();
    type Body = string;
    export interface Params {
      id?: Schemas.UUID;
      body: Body;
    }

    export type Payload =
      | ValidatedResponse<'Msg', 200, Schemas.Msg>
      | ValidatedResponse<'Msg', 400, Schemas.Msg>
      | ValidatedResponse<'Msg', 403, Schemas.Msg>
      | ValidatedResponse<'__Empty', 409, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 500, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/validate-name';
        const query = {} as Record<string, any>;
        if (params.id !== undefined) {
            query.id = params.id;
        }

        return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Schemas.Msg, 'Msg', 200),
                new ValidateRule(Schemas.Msg, 'Msg', 400),
                new ValidateRule(Schemas.Msg, 'Msg', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 409),
                new ValidateRule(Schemas.__Empty, '__Empty', 500)
            ]
        })
        .build();
    };
  }
  // GET /policies/{id}
  // Retrieve a single policy for a customer by its id
  export namespace GetPoliciesById {
    export interface Params {
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'Policy', 200, Schemas.Policy>
      | ValidatedResponse<'Msg', 403, Schemas.Msg>
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/{id}'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.Policy, 'Policy', 200),
                new ValidateRule(Schemas.Msg, 'Msg', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 404)
            ]
        })
        .build();
    };
  }
  // DELETE /policies/{id}
  // Delete a single policy for a customer by its id
  export namespace DeletePoliciesById {
    export interface Params {
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/{id}'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.__Empty, '__Empty', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 404)
            ]
        })
        .build();
    };
  }
  // POST /policies/{id}/enabled
  // Enable/disable a policy
  export namespace PostPoliciesByIdEnabled {
    const Enabled = z.boolean();
    type Enabled = boolean;
    export interface Params {
      id: Schemas.UUID;
      enabled?: Enabled;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 500, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/{id}/enabled'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        if (params.enabled !== undefined) {
            query.enabled = params.enabled;
        }

        return actionBuilder('POST', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.__Empty, '__Empty', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 404),
                new ValidateRule(Schemas.__Empty, '__Empty', 500)
            ]
        })
        .build();
    };
  }
  // GET /policies/{id}/history/trigger
  // Retrieve the trigger history of a single policy
  export namespace GetPoliciesByIdHistoryTrigger {
    const FilterOpId = z.enum([ 'equal', 'not_equal', 'like' ]);
    type FilterOpId = 'equal' | 'not_equal' | 'like';
    const FilterOpName = z.enum([ 'equal', 'like', 'not_equal' ]);
    type FilterOpName = 'equal' | 'like' | 'not_equal';
    const FilterId = z.string();
    type FilterId = string;
    const FilterName = z.string();
    type FilterName = string;
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const SortColumn = z.enum([ 'hostName', 'ctime' ]);
    type SortColumn = 'hostName' | 'ctime';
    const SortDirection = z.enum([ 'asc', 'desc' ]);
    type SortDirection = 'asc' | 'desc';
    export interface Params {
      id: Schemas.UUID;
      filterOpId?: FilterOpId;
      filterOpName?: FilterOpName;
      filterId?: FilterId;
      filterName?: FilterName;
      limit?: Limit;
      offset?: Offset;
      sortColumn?: SortColumn;
      sortDirection?: SortDirection;
    }

    export type Payload =
      | ValidatedResponse<
          'PagedResponseOfHistoryItem',
          200,
          Schemas.PagedResponseOfHistoryItem
        >
      | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 500, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/{id}/history/trigger'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        if (params.filterOpId !== undefined) {
            query['filter:op[id]'] = params.filterOpId;
        }

        if (params.filterOpName !== undefined) {
            query['filter:op[name]'] = params.filterOpName;
        }

        if (params.filterId !== undefined) {
            query['filter[id]'] = params.filterId;
        }

        if (params.filterName !== undefined) {
            query['filter[name]'] = params.filterName;
        }

        if (params.limit !== undefined) {
            query.limit = params.limit;
        }

        if (params.offset !== undefined) {
            query.offset = params.offset;
        }

        if (params.sortColumn !== undefined) {
            query.sortColumn = params.sortColumn;
        }

        if (params.sortDirection !== undefined) {
            query.sortDirection = params.sortDirection;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(
                    Schemas.PagedResponseOfHistoryItem,
                    'PagedResponseOfHistoryItem',
                    200
                ),
                new ValidateRule(Schemas.__Empty, '__Empty', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 404),
                new ValidateRule(Schemas.__Empty, '__Empty', 500)
            ]
        })
        .build();
    };
  }
  // PUT /policies/{policyId}
  // Update a single policy for a customer by its id
  export namespace PutPoliciesByPolicyId {
    const Dry = z.boolean();
    type Dry = boolean;
    export interface Params {
      policyId: Schemas.UUID;
      dry?: Dry;
      body: Schemas.Policy;
    }

    export type Payload =
      | ValidatedResponse<'Policy', 200, Schemas.Policy>
      | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 404, Schemas.__Empty>
      | ValidatedResponse<'Msg', 409, Schemas.Msg>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/policies/v1.0/policies/{policyId}'.replace(
            '{policyId}',
            params.policyId.toString()
        );
        const query = {} as Record<string, any>;
        if (params.dry !== undefined) {
            query.dry = params.dry;
        }

        return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Schemas.Policy, 'Policy', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Schemas.__Empty, '__Empty', 404),
                new ValidateRule(Schemas.Msg, 'Msg', 409)
            ]
        })
        .build();
    };
  }
}
